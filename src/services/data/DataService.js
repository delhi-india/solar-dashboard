import station_static from './station_static.json'

class DataService {
    static fetchStatic() {
        let capacitySum = 0
        let capacityMap = {}
        station_static['data'].forEach((v) => {
            capacityMap[v['_id']] = v['info']['powerCapacity'] || 0
            capacitySum += v['info']['powerCapacity'] || 0
        })
        let info = {
            capMap: capacityMap,
            capSum: capacitySum.toFixed(2)
        }
        return info
    }

    static fetchHistory() {
		return new Promise((resolve, reject) => {
            fetch('https://datalake.pravah.io:12434/history')
                .then((res) => {
                    res.json().then((res) => {
                        resolve(res)
                    })
                })
        })
	}
}

export default DataService