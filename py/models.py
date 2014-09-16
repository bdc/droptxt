from google.appengine.ext import ndb


class Key(ndb.Model):
  name = ndb.StringProperty(default='')
  value = ndb.StringProperty(default='')

  @classmethod
  def get(cls, name):
    return Key.query(Key.name == name).get().value


Key(id='example').put()
