import csv
import time
import datetime

gpsData = []
with open('gps.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # print(row['Timestamp'], row['id'], row['lat'], row['long'])
        d = dict(row)
        gpsData.append(d)

gpslen = len(gpsData)


carlist = []
for i in range(gpslen):
    if gpsData[i]['id'] not in carlist and int(gpsData[i]['id']) < 100:
        carlist.append(gpsData[i]['id'])

carlen = len(carlist)
carData = []
temp_time =''
for i in range(carlen):
    # carData.append([])
    for j in range(gpslen):
        if gpsData[j]['id'] == carlist[i]:
            carData.append([])
            templist = []
            templist.append(carlist[i])
            templist.append(gpsData[j]['Timestamp'])
            templist.append(gpsData[j]['lat'])
            templist.append(gpsData[j]['long'])
            # print templist
            carData[i].append(templist)
            temp_time = gpsData[j]['Timestamp']

# print carData[0][0][1]
# print carData[0][40][1]
# print time.mktime(datetime.datetime.strptime('01/06/2014 06:28:01', "%d/%m/%Y %H:%M:%S").timetuple())
# print time.mktime(datetime.datetime.strptime('01/06/2014 06:33:01', "%d/%m/%Y %H:%M:%S").timetuple())

startlist = []
endlist = []
for i in range(carlen):
    temp_len = len(carData[i])
    # startlist = []
    startlist.append(carData[i][0])
    # endlist = []
    for j in range(1,temp_len):
        # print carData[i][j][1]
        if(time.mktime(datetime.datetime.strptime(carData[i][j][1], "%m/%d/%Y %H:%M:%S").timetuple()) - time.mktime(datetime.datetime.strptime(carData[i][j-1][1], "%m/%d/%Y %H:%M:%S").timetuple()) > 600):
            # print '---'
            endlist.append(carData[i][j-1])
            # print carData[i][j-1]
            # print carData[i][j]
            startlist.append(carData[i][j])
    endlist.append(carData[i][j])

car1routeData = []

route_len = len(startlist)

route = []
for i in range(route_len):
    if startlist[i][0] == carlist[0]:
        route_temp = {'start' : startlist[i], 'end' : endlist[i]}
        car1routeData.append(route_temp)

car1routelen = len(car1routeData)

car1dateroute = []
tempdate = 0
# 86400
num = -1
for i in range(car1routelen):
    date = car1routeData[i]['start'][1][0:10]
    if date != tempdate:
        car1dateroute.append([])
        num += 1
        tempdate = date
    car1dateroute[num].append(car1routeData[i])

print car1dateroute,'+',num