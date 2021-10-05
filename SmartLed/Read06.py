import pycurl
from io import BytesIO
import RPi.GPIO as GPIO
from time import sleep

Relay1 = 11
Relay2 = 12

GPIO.setmode(GPIO.BOARD)
GPIO.setup(Relay1,GPIO.OUT)
GPIO.setup(Relay2,GPIO.OUT)
GPIO.output(Relay1,False)
GPIO.output(Relay2,False)

def SetRelayNOR():
    GPIO.output(Relay1,False)
    GPIO.output(Relay2,False)

def SetRelayFON():
    GPIO.output(Relay1,True)
    GPIO.output(Relay2,False)

def SetRelayFOF():
    GPIO.output(Relay1,False)
    GPIO.output(Relay2,True)


def ReadRelayCmd():
    b_obj = BytesIO() 
    crl = pycurl.Curl() 
# Set URL value
    crl.setopt(crl.URL, 'http://192.168.1.124/dream06.php?light_id=1')

# Write bytes that are utf-8 encoded
    crl.setopt(crl.WRITEDATA, b_obj)

# Perform a file transfer 
    crl.perform() 
    
# End curl session
    crl.close()

# Get the content stored in the BytesIO object (in byte characters) 
    get_body = b_obj.getvalue()
    #my_pwm.ChangeDutyCycle(float(get_body.decode('utf-8')))
    return get_body.decode('utf-8') 

while True:

    Cmd = ReadRelayCmd()
    if (Cmd == 'NOR'):
        print ('Set Relay to NOR')
        SetRelayNOR()
    elif (Cmd == 'FON'):
        print ("Set Relay to FON")
        SetRelayFON()
    elif (Cmd == 'FOF'):
        print ("Set Relay to FOF")
        SetRelayFOF()
    else:
        print ("Error in setting Relays")
    sleep(0.5)

        
    
    

