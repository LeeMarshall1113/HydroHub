import json, random, time, argparse
import paho.mqtt.client as mqtt

parser = argparse.ArgumentParser()
parser.add_argument('--valve', type=int, default=1)
parser.add_argument('--broker', default='localhost')
args = parser.parse_args()

client = mqtt.Client()
client.connect(args.broker, 1883)
state = False

def publish_state():
    topic = f"valve/{args.valve}/state"
    client.publish(topic, json.dumps({'state': state}), qos=1)

while True:
    flow = random.uniform(0.5, 3.5)
    pressure = random.uniform(20, 60)
    telemetry_topic = f"valve/{args.valve}/telemetry"
    client.publish(telemetry_topic, json.dumps({'flow': flow, 'pressure': pressure}), qos=1)
    if random.random()<0.1:
        state = not state
        publish_state()
    time.sleep(2)
