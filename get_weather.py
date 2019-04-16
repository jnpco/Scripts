import requests
import bs4

city = 'sydney'


def get_weather(location):
    location = location.replace(' ', '-')
    url = 'https://www.weather-forecast.com/locations/{}/forecasts/latest'.format(
        location)
    soup = bs4.BeautifulSoup(requests.get(url).content, 'lxml')

    forecast_table = soup.select_one(
        'table.b-forecast__table.js-forecast-table')

    thead = forecast_table.select_one('thead')
    tbody = forecast_table.select_one('tbody')

    forecast_rows = {
        # 1-3, 4-7, 7-10 days summaries
        'three_day_summary': thead.select('tr.b-forecast__table-description.b-forecast__hide-for-small.days-summaries span.phrase'),
        # Odd idx is the day of the week, followed by date
        'days': thead.select('tr.b-forecast__table-days.js-forecast-header.js-daynames span.b-forecast__table-days-name,span.b-forecast__table-days-date'),

        # Same no. of columns
        # Morning Evening Night
        'period': thead.select('tr.b-forecast__table-time.js-daytimes span.b-forecast__table-value'),
        # Wind km/h
        'wind': tbody.select('tr.b-forecast__table-wind div.b-forecast__table-wind-container text.wind-icon-val'),
        # Summary clear, cloudy etc.
        'summary': tbody.select('tr.b-forecast__table-summary td.b-forecast__table-day-end div.b-forecast__text-limit')
    }
    # if not am, arrange data set

    for row in forecast_rows:
        print(row + ' col no. --> ' + str(len(forecast_rows[row])) + '\n')
        for item in forecast_rows[row]:
            print(item.text)
        print('------------------------------------------------------------')


get_weather('sydney')
