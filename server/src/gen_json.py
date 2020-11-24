RANGE = 3000
time = 5
value = 5000
print("{")
print("\"username\":\"123\",")
print("\"sentences\":[")
for i in range(RANGE):
	if i == RANGE - 1:
		print("{\"value\":\"%f\",\"start\":\"%f\",\"end\":\"%f\"}" % (value + i, time + 0.02 * i, time + 0.01 * i + 0.001))
	else:
		print("{\"value\":\"%f\",\"start\":\"%f\",\"end\":\"%f\"}," % (value + i, time + 0.02 * i, time + 0.01 * i + 0.001))
print("],")
print("\"words\":[")
for i in range(RANGE):
	if i == RANGE - 1:
		print("{\"value\":\"%f\",\"start\":\"%f\",\"end\":\"%f\"}" % (value + i, time + 0.02 * i, time + 0.01 * i + 0.001))
	else:
		print("{\"value\":\"%f\",\"start\":\"%f\",\"end\":\"%f\"}," % (value + i, time + 0.02 * i, time + 0.01 * i + 0.001))
print("],")
print("\"phonemes\":[")
for i in range(RANGE):
	if i == RANGE - 1:
		print("{\"notation\":\"%f\",\"start\":\"%f\",\"end\":\"%f\",\"languare\":\"russian\",\"dialect\":\"null\"}" % (value + i, time + 0.01 * i, time + 0.01 * i + 0.001))
	else:
		print("{\"notation\":\"%f\",\"start\":\"%f\",\"end\":\"%f\",\"languare\":\"russian\",\"dialect\":\"null\"}," % (value + i, time + 0.01 * i, time + 0.01 * i + 0.001))
print("]")
print("}")