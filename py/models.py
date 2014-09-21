from google.appengine.ext import ndb


class SecretKey(ndb.Model):
  name = ndb.StringProperty(default='')
  value = ndb.StringProperty(default='')

  @classmethod
  def get(cls, name):
    return cls.query(cls.name == name).get().value


class User(ndb.Model):
  user_email = ndb.StringProperty(default='')
  oauth_token = ndb.StringProperty(default='')
  dropbox_user_id = ndb.StringProperty(default='')

  @classmethod
  def get_token(cls, user_email):
    inst = cls.query(cls.user_email == user_email).get()
    return inst.oauth_token if inst else None


SecretKey(id='example').put()
