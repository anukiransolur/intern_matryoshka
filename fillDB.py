#!/usr/bin/python

##
# script to import an Armadillo.xml into the Matryoshka database
##

import sys
import MySQLdb
import re


dbname = 'visualization'
#dbname = 'parser'


# determine input parameters
argc = len(sys.argv)
if (argc < 2): 
  print 'Call: %s filename.xml [-m \'description_text\']' % (sys.argv[0])
  sys.exit(-1)

filename = sys.argv[1]

if (argc > 3):   
  description = sys.argv[3]         
else:
  description = 'Data from file \'%s\'' % (filename);

print "Description is \'%s\'" % description 


# open database connections
db = MySQLdb.connect(host="localhost", user="matryoshka",
                     passwd="matrypw", db=dbname)                                           
cur = db.cursor()
          
old_percent = 0

# read header of input file to validate it
input = open(filename, "r")

header = input.readline()
assert(header == '<?xml version="1.0" encoding="UTF-8"?>\n')

root_tag = input.readline()
assert(root_tag == '<root>\n')


##########################################################################
def print_percent(done, total):
  global old_percent
  percent = int(float(done)/total*100.0)
  if percent > old_percent:
    print '%d%% completed <br>' % (percent)
    old_percent = percent


##########################################################################
def parse_line(line):
  m = re.search(' *<([^ ]+)[ ]?([^=]*)=?"?([^">]*)"?>', line)
      
  if (m == None):
    result = ["content", line.strip(' \n')]
    return result

  element = m.group(1)    
  if element[0] == '/':
    element = element[1:]
    result = ["closing tag"]
  else:
    result = ["opening tag"]
         
  result.append(element)

  attribute = m.group(2)
  if (attribute != ""):    
    result.append(attribute)
    
  value = m.group(3)                  
  if (value != ""):        
    result.append(value)
    
  return result    
##########################################################################


##########################################################################
class ApplicationRegistration:
  file_id = None
  uid = None
  name = None
  description = None  
  tsc_speed = None
  
  def store(self):
    if self.description == None:
      self.description = name
      
    self.description = self.description.replace('\'', '\\\'') # replace apostrophes by escaped ones
         
    # protect other clients from inserting before we obtain the auto-incremented file_id
    cur.execute('LOCK TABLES file_ids WRITE')
         
    cmd = "INSERT INTO file_ids SET filename=\'%s\', description=\'%s\'" % (filename, self.description)    
    cur.execute(cmd)
    
    cmd = 'SELECT LAST_INSERT_ID()'    
    cur.execute(cmd)
    row = cur.fetchone()
    assert(row != None)
    self.file_id = row[0]
    
    cmd = "UNLOCK TABLES"    
    cur.execute(cmd)
  
##########################################################################

##########################################################################
class ApplicationInstance:
  application_type = None
  file_id = None
  uid = None
  group = None
  instance = None
 
  def store(self):
    assert(self.file_id != None)
    cmd = "INSERT INTO application_types VALUES (%d, x\'%s\', \'%s\', \'%s\')" % (self.file_id, self.uid[2:], self.group, self.instance)    
    cur.execute(cmd)
    
##########################################################################


##########################################################################
class TransactionRegistration:
  file_id = None
  name = None
  uid = None 
  
  def store(self):    
    self.uid = self.uid[2:] # cut leading '0x'
    cmd = "INSERT INTO transaction_types VALUES (%d, x\'%s\', \'%s\')" % (self.file_id, self.uid, self.name)    
    cur.execute(cmd)

##########################################################################


##########################################################################
class TransactionInstance:
  
  def __init__(self):
    self.file_id = None
    self.application_type = None
    self.transaction_type = None
    self.uid = None
    self.context = None
    self.correlator = None
    self.parent_correlator = None # may not have one 
    self.start_time = None
    self.stop_time = None
    self.start_time_tsc = None
    self.stop_time_tsc = None
    self.status = None
    self.iteration = None
  
  def store(self):
    if self.parent_correlator is None:
      self.parent_correlator = 'NULL'
    else:
      self.parent_correlator = 'x\'' + self.parent_correlator[2:] + '\''
    
    
    if self.application_type == None:
      self.application_type = '0x00000000000000000000000000000000'
    
    #assert(self.application_type != None)
    assert(self.correlator != None)

    cmd = ("INSERT INTO transactions VALUES (%d, x\'%s\', x\'%s\', x\'%s\', x\'%s\', %s, %d, %d, %d, \'%s\')" 
      % (self.file_id, self.uid[2:], self.application_type[2:], self.transaction_type[2:], self.correlator[2:], self.parent_correlator, 
         self.start_time, self.stop_time,
         self.iteration, self.context)
        )  
    cur.execute(cmd)

    
##########################################################################


file_entry = None
application_types_map = {}  
transaction_types_map = {}  
transaction_map = {}

inside_event = False
event_type = None
event_subject = None
subevent_type = None
subevent_unit = None

transaction_level = 0
transaction_iteration = 0
container = None

nrline = 0
totallines = 0
lines = []
old_percent = 0

# read body of input file into memory
for line in input:
  lines.append(line)
  totallines += 1

# parse the input data and create data structures 
for line in lines:
  print_percent(nrline, totallines) 
  nrline += 1

  result = parse_line(line)
    
  if not inside_event:  
    if result[0] == 'opening tag':      
      inside_event = True
      event_type = result[1]
      event_subject = result[3]              
      continue
      
  else: # look for closing of event       
    if result[0] == 'closing tag' and result[1] == event_type:      
      inside_event = False
      event_type = None
      if container != None:
        container = None
      continue
      
  if event_type == 'registered':
        
    if event_subject != None:
      if subevent_type == None:
        subevent_type = result[1]
        continue
      else:
        if result[0] == 'closing tag': #closing of subtag
          subevent_type = None
          continue
    
    if event_subject == 'application':
      assert(result[0] == 'content')
      if container == None:
         container = ApplicationRegistration()
         container.description = description
         file_entry = container
      
      if subevent_type == 'name':
        container.name = result[1]               
               
      if subevent_type == 'uid':
        container.uid = result[1]
              
      if subevent_type == 'tsc_speed':
        container.tsc_speed = result[1]


    if event_subject == 'transaction':
      assert(result[0] == 'content')
      if container == None:
         container = TransactionRegistration()
      
      if subevent_type == 'name':
        container.name = result[1]

      if subevent_type == 'uid':
        container.uid = result[1]
        transaction_types_map[container.uid] = container


  if event_type == 'started':
        
    if event_subject != None:
      if subevent_type == None:
        subevent_type = result[1]        
        if (len(result) > 3):
          subevent_unit = result[3]
        
        continue
      else:
        if result[0] == 'closing tag':
          subevent_type = None
          subevent_unit = None
          continue   


    if event_subject == 'application':
      assert(result[0] == 'content')
      if container == None:
         container = ApplicationInstance()
      
      if subevent_type == 'uid':
        container.uid = result[1]
        application_types_map[container.uid] = container

      if subevent_type == 'group':
        container.group = result[1]            
                             
      if subevent_type == 'instance':
        container.instance = result[1]
        

    if event_subject == 'transaction':
      assert(result[0] == 'content')        
      if container == None:
         container = TransactionInstance()
         transaction_level += 1
         container.iteration = transaction_iteration
                           
      if subevent_type == 'application_instance_uid':
        container.application_type = result[1]          
                           
      if subevent_type == 'transaction_uid':
        container.transaction_type = result[1]                                                            
                           
      if subevent_type == 'uid':
        container.uid = result[1]
        transaction_map[container.uid] = container

      if subevent_type == 'context':
        container.context = result[1]
        
      if subevent_type == 'parent_correlator':
        container.parent_correlator = result[1]
        
      if subevent_type == 'correlator':
        container.correlator = result[1]        
       
      if subevent_type == 'time':
        if (subevent_unit == 'us'):
          container.start_time = int(result[1])
        if (subevent_unit == 'ticks'):
          container.start_time_tsc = int(result[1])

  
  if event_type == 'stopped':
        
    if event_subject != None:
      if subevent_type == None:
        subevent_type = result[1]
        if (len(result) > 3):
          subevent_unit = result[3]
          
        continue
      else:
        if result[0] == 'closing tag':
          subevent_type = None
          continue   

    if event_subject == 'transaction':
      assert(result[0] == 'content')
      if subevent_type == 'uid':
        assert(container == None)
        container = transaction_map[result[1]]
        transaction_level -= 1
        assert(transaction_level >= 0)
        if (transaction_level == 0):
          container.iteration = transaction_iteration
          transaction_iteration += 1          


      if subevent_type == 'time':
        if (subevent_unit == 'us'):
          container.stop_time = int(result[1])
        if (subevent_unit == 'ticks'):          
          container.stop_time_tsc = int(result[1])


# fill DB
print 'Parsing complete.'
print 'Now filling the database'

old_percent = 0
total_queries = len(application_types_map) + len(transaction_types_map) + len(transaction_map)
print total_queries, " rows to be inserted in total"
done_queries = 0

# new file entry
file_entry.store()
assert(file_entry.file_id != None)
done_queries += 1
        
# application types (i.e. SmarTest layers)
for at in application_types_map.itervalues():
  print_percent(done_queries, total_queries)  
  at.file_id = file_entry.file_id
  at.store()
  done_queries += 1
    
# transaction types (i.e. SmarTest applications)
for tt in transaction_types_map.itervalues():
  print_percent(done_queries, total_queries)
    
  tt.file_id = file_entry.file_id
  tt.store()
  done_queries += 1

# finally print out the list of collected transactions
for t in transaction_map.itervalues():
  print_percent(done_queries, total_queries)
    
  t.file_id = file_entry.file_id
  t.store()
  done_queries += 1
