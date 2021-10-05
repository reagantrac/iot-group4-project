'''
date: 03/10/2021

author: Wei Yang
'''
# built_in 
import os 
import time 
import json 
import sys
# import pycurl 
import logging 
import threading


# third_party 
from PiicoDev_VEML6030 import PiicoDev_VEML6030
import RPi.GPIO as GPIO 


# local 
# import light
# import motion

lock = threading.Lock()
global debug
debug = True 

logging.basicConfig(filename="room.log",
					format= '%(asctime)s.%(msecs)03d, %(name)s, %(levelname)s, %(message)s',
					level=logging.DEBUG) 


class MotionSensorThread(threading.Thread): 
	""" 
	This thread monitors two motion sensors and calculates the number of 
	people in the room. 
	""" 
	def __init__(self, owner, sensor_type, pin_num): 
		self.owner = owner
		self.flag_to_read = False # Flag true when there is a value to read 
		self.sensor_type = sensor_type
		self.pin_num = pin_num 
		threading.Thread.__init__(self) 
		self.logger = logging.getLogger("Motion_{}".format(self.sensor_type))
		
		self.ret_value = 0 
		self.motion_sensor_in = None 
		self.pin_motion_sensor_in = self.pin_num 
		
		# GPIO.setmode(GPIO.BOARD) 
		GPIO.setup(self.pin_num, GPIO.IN)  # 16 in 
		
		self.timer_no_response = 2
		self.timer_no_response_start = False
			
	def read_motion_sensor_output(self, pin_num): 
		"""
		Args: 
			pin_num: the number assigned to the output of the sensor
		Return: 
			The return value is int 
			0: off 
			1: on 
		""" 
		return GPIO.input(pin_num)
	
	def add_motion_sequence(self): 
		"""
		Pass the sensor_type 
		The sensor_type is string, "in" or "out"
		"""
		with lock: 
			if self.flag_to_read is True: 
				num = len(self.owner.motion_sequence)
				if num == 0 : 
					self.owner.motion_sequence.append(self.sensor_type) 
					
					self.timer_no_response_start = True 
					
				elif num == 1:
					if self.owner.motion_sequence[0] is not self.sensor_type: 
						self.owner.motion_sequence.append(self.sensor_type)
						
						self.timer_no_response_start = True
						
					else: 
						# This sensor type has already been added 
						pass
				else: 
					
					pass
							
	def flag_trigger(self): 
		"""
		"""
		with lock: 
			self.flag_to_read = True
	
	def run(self): 
		
		while True: 
			if self.timer_no_response_start is False: 
				ret = self.read_motion_sensor_output(self.pin_motion_sensor_in) 
				self.logger.info("This is the reading from output:{}".format(ret))
				if ret == 1:
					self.flag_trigger() 
					
					print("The {} motion sensor has been triggered".format(self.sensor_type))
					self.add_motion_sequence()
			else: 
				time.sleep(self.timer_no_response)
				self.timer_no_response_start = False
				

class LightSensorThread(threading.Thread): 
	"""
	""" 
	def __init__(self, owner): 
		threading.Thread.__init__(self) 
		self.owner = owner
		self.light_val_lux = 20
		self.light_lux_upper_max = self.owner.light_lux_upper_max
		self.light_lux_down_min = self.owner.light_lux_down_min
		self.bright_enough = True
		
		if debug is True: 
			self.light_connection = None 
		else: 
			self.light_conenction = PiicoDev_VEML6030(bus=1, 
														freq= 0, 
														sda= 0, 
														scl= 0, 
														addr=0x10)
	
	def read_light_val(self): 
		"""
		"""
		self.light_val_lux = self.light_connection.read() 
		print("Read the light value is: {} lux".format(light_val)) 
	
	def check_bright_enough(self): 
		""" 
		""" 
		with lock:
			if self.light_val_lux > self.light_lux_upper_max: 
				print("The light val is high enough, bright enough")
				self.bright_enough = True  
			
			elif self.light_val_lux < self.light_lux_down_min:
				print("The light val is low enough, not bright enough")
				self.bright_enough = False 

	def run(self): 
		
		while True: 
			print("Hello Light") 
			# self.read_light_val() 
			self.check_bright_enough()
			time.sleep(1)


class WebInterfaceThread(threading.Thread): 
	"""
	"""
	def __init__(self): 
		"""
		"""


class Room(object): 
	"""
	"""
	def __init__(self): 
		"""
		"""
		
		# General 
		self.num_people_inside = 0 
		self.motion_sequence = [] 
		self.polling_interval = 1 # sec		
		self.logger = logging.getLogger("Room")
		self.logger.info("*************************")
		self.logger.info("Start Smart Light System") 
		self.logger.info("*************************")
		
		# GPIO configuration 
		GPIO.setmode(GPIO.BOARD) 

		## LED pwm output 
		GPIO.setup(18, GPIO.OUT) 
		# self.turn_off_light()
		# self.led_pwm = GPIO.PWM(18, 1000) 
		# self.led_pwm.start(50)

		# Light sensor 
		self.light_lux_upper_max = 500
		self.light_lux_down_min = 400 
		
		# Motion sensor 
		
		
		# Led control 
		self.light_on = False # the status of the light 
		self.start_countdown = True
		self.countdown_timer = 10 
		self.countdown_timer_start = 0
		
		# Website interface 
		

		
		self.light_sensor_thread = LightSensorThread(self)
		self.motion_sensor_in_thread = MotionSensorThread(self, "in", 16)
		self.motion_sensor_out_thread = MotionSensorThread(self, "out", 22) 
			
	def check_if_light_enough(self): 
		"""
		Args: 
		
		
		Return: 
			int 
		"""
		with lock:
			current_light = self.light_sensor_thread.bright_enough
		
		return current_light
		
	def calculate_num_people_in_room(self): 
		""" 
		Args: 
		
		
		Return: 
			int 
		""" 
		with lock: 
			if self.num_people_inside >= 0: 
				if len(self.motion_sequence) == 2: 
					self.logger.info("The motion_sequence has been 2") 
					self.logger.info("{}".format(self.motion_sequence))
					
					if self.motion_sequence == ["in", "out"]: 
						print("Add one person") 
						self.num_people_inside += 1
					elif self.motion_sequence == ["out", "in"]: 
						print("Remove one person")
						self.num_people_inside -= 1 
					
					# Clear the sequence and next enter/exit 
					self.motion_sequence = []
					self.motion_sensor_in_thread.flag_to_read = False 
					self.motion_sensor_out_thread.flag_to_read = False
				elif len(self.motion_sequence) == 1: 
					print("The enter/exit action has not been finished") 
					print("This is the motion_sequence:{}".format(self.motion_sequence))
			else: 
				print("ERROR, the number of people cannot be negative")
	
	def turn_on_light(self): 
		print("The light has been turned on now") 
		if self.light_on is True: 
			self.logger.info("The light has already been on, no need to turn on") 
		else: 
			GPIO.output(18,1)
			self.light_on = True
	
	def turn_off_light(self): 
		print("The light has been turned off now") 
		GPIO.output(18, 0)
		self.light_on = False
	
	def start_timer(self): 
		"""
		""" 
		print("Start the timer for {} seconds".format(self.countdown_timer))
		self.countdown_timer_start = time.time()
		print("The Starting point is:{}".format(time.time()))
		self.start_countdown = True
	
	def reset_timer(self): 
		""" 
		Stop the timer and reset to the initial status
		""" 
		print("Reset the timer and stop countdown")
		self.start_countdown = False 

	def run(self): 
		self.motion_sensor_in_thread.start() 
		self.motion_sensor_out_thread.start()
		self.light_sensor_thread.start()
		self.turn_off_light()
		while True: 
			
			self.calculate_num_people_in_room()
			
			if self.check_if_light_enough() is True:
				# The light should not be on anyway 
				if self.light_on is True: 
					print("The light is on, but it is bright enought, turn off the light")
					self.turn_off_light() 
				else: 
					print("The light is off and it is bright enough")
			else: 
				if self.num_people_inside == 0:
					if self.light_on is True:
						if self.start_countdown is False: 
							self.start_timer()
						else:
							current = time.time()
							remaining = current - self.countdown_timer_start
							
							if remaining < self.countdown_timer: 
								# waiting for countdown 
								print("The light is on and counting down to turn off the light") 
								print("The remaining time is:{}".format(self.countdown_timer - remaining)) 
							else: 
								print("The countdown is finished, no one is in the room, turn off light now")
								self.turn_off_light()
					else: 
						print("The light is off and no on in the room") 
				else: 
					self.reset_timer() 
					
					if self.light_on is False:
						self.turn_on_light()
						print("The light is on and {} people in the room".format(self.num_people_inside))
			
			# polling every # seconds
			time.sleep(self.polling_interval)


def main(room_cls, config_filename):
	# Parse command lines or inputs 
	
	# Load the existing configuration files 
	try: 
		room = room_cls() 
		room.run() 
	except Exception as e: 
		print(e) 
	finally: 
		GPIO.cleanup()
		os._exit(os.X_OK) 

if __name__ == '__main__': 
	main(Room, None) 
