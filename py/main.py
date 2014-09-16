import webapp2
from oauth2client.appengine import OAuth2Decorator

from lib import dropbox

from . import models


oauth_decorator = OAuth2Decorator(
    auth_uri='https://www.dropbox.com/1/oauth2/authorize',
    token_uri='https://api.dropbox.com/1/oauth2/token',
    client_id=models.Key.get('DROPBOX_APP_KEY'),
    client_secret=models.Key.get('DROPBOX_APP_SECRET'),
    scope='')
# TODO how to prevent oauth_decorator from sending 'access_type' field
# oauth_decorator.flow.params['access_type']


class MainHandler(webapp2.RequestHandler):

  @oauth_decorator.oauth_required
  def get(self):  # pylint:disable-msg=invalid-name
    """Handle GET requests."""
    self.response.write("""Hello, world!3.""")


app = webapp2.WSGIApplication([
    ('/.*', MainHandler),
    (oauth_decorator.callback_path, oauth_decorator.callback_handler()),
], debug=True)

