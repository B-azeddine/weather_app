export function convertWindSpeed(speedInMetersPerSecond:number) :string{
	const speedInKmPerHour = speedInMetersPerSecond * 3.6;	
	return `${speedInKmPerHour.toFixed(0)}km/h`
}