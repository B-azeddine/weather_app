
export function convertKelvinToCelcius(kelvinTemp : number): number{
	const celciusTemp = kelvinTemp - 273.15;
	return Math.floor(celciusTemp);
}