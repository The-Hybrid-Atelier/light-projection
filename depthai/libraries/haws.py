__name__ = "haws"

import json, os, wave, struct, time, glob
import sys, time, threading, abc
import pprint
import websocket
from websocket import create_connection


class JSONWebSocketClient:
  def __init__(self, name, uri):
    self.uri = uri
    self.on_register = {}
    self.name = name
    self.connected = False

  def connect(self):
    self.ws = create_connection(self.uri)
    print("\tListening on %s"% (self.uri))
    self.ws.settimeout(1)
    print("\tTimeout is %f"%(self.ws.gettimeout()))
    self.greet()
    self.connected = True

  def greet(self):
    greeting = {}
    greeting["name"] = self.name
    greeting["event"] = "greeting"
    self.send(greeting)

  def close(self):
    if self.connected:
      self.ws.close()
    self.connected = False

  # Use this listen; needs to be placed in a while loop
  def listen(self):
    raw_msg = ""
    
    if self.ws:
      try:
        raw_msg = self.ws.recv()
      except:
        raw_msg = None

      if raw_msg:
        msg = json.loads(raw_msg)
        self.handle_api_call(msg)
        self.handle_event_call(msg)
        return True
      else:
        return False
       
  def handle_event_call(self, msg):
    # IF API COMMAND
    if "sender" in msg and "event" in msg:
      key = msg["sender"] + msg["event"]
      action = msg["event"]
      self.handle_call(key, action, msg)

  def handle_api_call(self, msg):
    # IF API COMMAND
    if "sender" in msg and "api" in msg:
      key = msg["sender"] + msg["api"]["command"]
      action = msg["api"]["command"]
      self.handle_call(key, action, msg)

  def handle_call(self, key, action, msg):
    if key in self.on_register:
      action_r, callback, obj = self.on_register[key]
      if action == action_r:
        if "debug" in msg:
          print("CALL << ", msg, " \n")
        callback(self, msg, obj)
          
  def send(self, msg):
    if hasattr(self, "ws"):
      try:
        self.ws.send(json.dumps(msg))
      except:
        pass
    if "debug" in msg:
      if msg["debug"]:
        print("Sending >> ", msg)

  def subscribe(self, sender, service):
    self.send({"subscribe": sender, "service": service})
    
  def unsubscribe(self, sender, service):
    self.send({"unsubscribe": sender, "service": service})

  def send_event(self, event, params={}):
    message = {"event": event}
    for key in params:
      message[key] = params[key]
    self.send(message)

  def on(self, sender_name, action, callback, obj=None):
    self.subscribe(sender_name, action)
    self.on_register[sender_name + action] = (action, callback, obj)
 