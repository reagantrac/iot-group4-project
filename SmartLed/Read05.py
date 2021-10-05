import pycurl
from io import BytesIO 
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(18,GPIO.OUT)

my_pwm = GPIO.PWM(18,1000)
my_pwm.start(50)



while True:
    b_obj = BytesIO() 
    crl = pycurl.Curl() 
# Set URL value
    crl.setopt(crl.URL, 'http://192.168.1.124/dream05.php?light_id=1')

# Write bytes that are utf-8 encoded
    crl.setopt(crl.WRITEDATA, b_obj)

# Perform a file transfer 
    crl.perform() 
    
# End curl session
    crl.close()

# Get the content stored in the BytesIO object (in byte characters) 
    get_body = b_obj.getvalue()
    my_pwm.ChangeDutyCycle(float(get_body.decode('utf-8')))
# Decode the bytes stored in get_body to HTML and print the result 
# print('Output of GET request:\n%s' % get_body.decode('utf8')) 
