import jinja2
import json
import logging
import os
import webapp2
from webapp2_extras import sessions
from google.appengine.api import users

from lib import dropbox

from . import models


jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'jinja')),
    extensions=['jinja2.ext.autoescape'],
    variable_start_string='[[',
    variable_end_string=']]',
    autoescape=True)

config = {
  'webapp2_extras.sessions': {'secret_key': 'text-sync'},
}


class BaseHandler(webapp2.RequestHandler):
  def dispatch(self):
    self.session_store = sessions.get_store(request=self.request)
    try:
      webapp2.RequestHandler.dispatch(self)
    finally:
      self.session_store.save_sessions(self.response)

  @webapp2.cached_property
  def session(self):
    return self.session_store.get_session()


class MainHandler(BaseHandler):

  def get(self):
    oauth_token = get_oauth_token(self.session)
    if not oauth_token:
      flow = get_oauth_flow(self.session)
      self.redirect(flow.start())
    template = jinja_env.get_template('index.html')
    self.response.write(template.render())

  def oauth2callback(self):
    result = get_oauth_flow(self.session).finish(self.request.GET)
    access_token, dropbox_user_id, url_state = result
    set_oauth_token(self.session, dropbox_user_id, access_token)
    self.redirect(webapp2.uri_for('app-main'))

  def webhook(self):
    # not implemented
    # self.response.write(self.request.get('challenge'))
    logging.info(self.request.body)
    try:
      user_ids_list = json.loads(self.request.body)['delta']['users']
    except Exception as e:
      logging.warn(e)
      return


def get_oauth_flow(session):
  return dropbox.client.DropboxOAuth2Flow(
      models.SecretKey.get('DROPBOX_APP_KEY'),
      models.SecretKey.get('DROPBOX_APP_SECRET'),
      webapp2.uri_for('oauth2callback', _full=True),
      session, 'dropbox-auth-csrf-token')


class AjaxHandler(BaseHandler):

  def get_file(self, path=None):
    logging.info('get_file: %s', path)
    oauth_token = get_oauth_token(self.session)
    client = dropbox.client.DropboxClient(oauth_token)
    f, metadata = client.get_file_and_metadata(path)
    self.response.write(json.dumps({
      'metadata': metadata,
      'content': f.read(),
    }))


def get_oauth_token(session):
  user_email = users.get_current_user().email()
  if not user_email:
    return None
  if 'oauth_token' in session:
    return session['oauth_token']
  return models.User.get_token(user_email)


def set_oauth_token(session, dropbox_user_id, oauth_token):
  user_email = users.get_current_user().email()
  logging.info(user_email)
  session['oauth_token'] = oauth_token
  models.User(
      user_email=user_email, dropbox_user_id=dropbox_user_id,
      oauth_token=oauth_token).put()


app = webapp2.WSGIApplication([
  webapp2.Route(
    '/webhook', handler=MainHandler, handler_method='webhook', name='webhook'),
  webapp2.Route(
    '/oauth2callback', handler=MainHandler, handler_method='oauth2callback',
    name='oauth2callback'),
  webapp2.Route('/j/get_file/<path:.+>', handler=AjaxHandler,
    handler_method='get_file'),
  webapp2.Route('/', handler=MainHandler, name='app-main'),
  ('/.*', MainHandler),
], config=config, debug=True)

