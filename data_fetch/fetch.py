import json
import pytz

from dlake import Datalake
from datetime import datetime


def main():
    datalake = Datalake('pravah', 'Pr@v@h@dm!n', '/SolarPowerProduction')

    cur = datalake.aggregate(
        group_by = 'item.stations.id', 
        push={
            'timestamp': '$item.stations.timestamp',
            'currentPowerOutput': '$item.stations.powerGenerationParameters.currentPowerOutput',
            'powerGeneratedToday': '$item.stations.powerGenerationParameters.powerGeneratedToday',
            'irradiation': '$item.stations.powerGenerationParameters.irradiation'
        }, 
        start="2020/01/03 06:30:00", 
        end="2020/01/03 23:30:00"
    )

    stations = {}
    for i in cur:
        if not is_int(i['_id'][0]):
            timestamp = []
            current_power_output = []
            power_generated_today = []
            irradiation = []
            
            station_id = i['_id'][0]

            for t in i['all']:
                timestamp.append(datetime.fromtimestamp(int(t['timestamp'][0])).strftime("%d/%m/%Y %H:%M:%S"))
                current_power_output.append(t['currentPowerOutput'][0])
                power_generated_today.append(t['powerGeneratedToday'][0])
                irradiation.append(t['irradiation'][0])
            
            stations[station_id] = {
                'timestamp': timestamp,
                'currentPowerOutput': current_power_output,
                'powerGeneratedToday': power_generated_today,
                'irradiation': irradiation
            }
    with open('stations_data.json', 'w') as st:
        json.dump(stations, st)

def is_int(i):
    try:
        a = int(i)
        return True
    except:
        return False

if '__main__' == __name__:
    main()