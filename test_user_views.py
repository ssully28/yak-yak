"""User View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_user_views.py


import os
from unittest import TestCase
from sqlalchemy.exc import IntegrityError

from models import db, connect_db, Message, User, Like

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False


class MessageViewTestCase(TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()
        Like.query.delete()

        self.client = app.test_client()

        self.testuser = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser",
                                    image_url=None)

        db.session.commit()

    def test_add_user(self):
        """
        Test that route '/signup' creates
        a new user.
        """

        resp = self.client.post("/signup", data={"username": "testuser2",
                                                 "email": "test2@test2.com",
                                                 "password": "test2user",
                                                 "image_url": None
                                                 }, follow_redirects=True)

        self.assertEqual(resp.status_code, 200)
        self.assertIn(b'<p>@testuser2</p>', resp.data)

    def test_fail_add(self):
        """Test that we gracefully handle failed signup"""

        # Create test user 2 via model
        # Note:  We were unable to test running
        # two posts in the same function, so adding
        # this user via the model:
        User.signup(username="testuser2",
                    email="test2@test.com",
                    password="testuser",
                    image_url=None)

        db.session.commit()

        # Now test if we properly handle a failed signup:
        resp2 = self.client.post("/signup", data={"username": "testuser2",
                                                  "email": "test2@fail.com",
                                                  "password": "test2fail",
                                                  "image_url": None
                                                  })

        self.assertEqual(resp2.status_code, 200)
        self.assertIn(b'<div class="alert alert-danger">Username already taken</div>', resp2.data)



    #def test_


    #######################################################
    ## SAMPLE VIEW TEST:
    # def test_add_message(self):
    #     """Can use add a message?"""

    #     # Since we need to change the session to mimic logging in,
    #     # we need to use the changing-session trick:

    #     with self.client as c:
    #         with c.session_transaction() as sess:
    #             sess[CURR_USER_KEY] = self.testuser.id

    #         # Now, that session setting is saved, so we can have
    #         # the rest of ours test

    #         resp = c.post("/messages/new", data={"text": "Hello"})

    #         # Make sure it redirects
    #         self.assertEqual(resp.status_code, 302)

    #         msg = Message.query.one()
    #         self.assertEqual(msg.text, "Hello")