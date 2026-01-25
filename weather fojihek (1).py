import sys

import pygame
import requests
from typing import Union

pygame.init()

# Check for saved locations
try:
    with open('./weather/weather', 'r') as f:
        f.read()
        f.close()
except:
    try:
        with open('./weather/weather', 'w') as f:
            f.write('')
            f.close()
        with open('./weather/0x', 'w') as f:
            f.write('44')
            f.close()
        with open('./weather/0y', 'w') as f:
            f.write('70')
            f.close()
        with open('./weather/0name', 'w') as f:
            f.write('Yarmouth')
            f.close()
        locations = [[44, 70, 'Yarmouth']]
    except:
        print('Weather folder does not exist.')
        pygame.QUIT
        sys.exit()

else:
    with open('./weather/numberoflocations', 'r')as f:
        numberOfLocations = int(f.read())
        f.close()
    locations = []
    for i in range(numberOfLocations):
        with open(''.join(['./weather/', str(i), 'x']), 'r') as f:
            x = float(f.read())
            f.close()
        with open(''.join(['./weather/', str(i), 'y']), 'r') as f:
            y = float(f.read())
            f.close()
        with open(''.join(['./weather/', str(i), 'name']), 'r') as f:
            name = f.read()
            f.close()
        locations.append([x, y, str(name)])
        print(locations)


screen_width = 1300
forecast_width = 900
screen_height = 700
screen = pygame.display.set_mode(
    (screen_width, screen_height), pygame.RESIZABLE)

forecast = pygame.Surface((forecast_width, 9000))
sidebar = pygame.Surface((300, screen_height), pygame.SRCALPHA)

try:
    fontbig = pygame.font.Font('Inter-Light.ttf', 65)
    fontmid = pygame.font.Font('Inter-Light.ttf', 50)
    fontsmall = pygame.font.Font('Inter-Light.ttf', 20)
    fonts_installed = True
except:
    fontbig = pygame.font.Font(None, 65)
    fontmid = pygame.font.Font(None, 50)
    fontsmall = pygame.font.Font(None, 20)
    fonts_installed = False


bg = (255, 255, 255)
locationPickerRectCol = (235, 235, 235)
lightmode = True

location = locations[0]
textcol = (0, 0, 0)

locationPickerRect = pygame.Rect(0, 0, 300, 50)
locationPickerRect.centerx = (int(screen_width / 2))
locationPickerRect.top = 10
pickingLocation = 0

clicked = False

needToUpdate = True

locationName = ''


# nws offices

def make_font(size: int):
    if fonts_installed:
        font = pygame.font.Font("Inter-Light.ttf", size)
    else:
        font = pygame.font.Font(None, size)
    return font


def draw_text(text: str, font: pygame.font.Font, text_col: tuple[int, int, int], x: float, y: float,
              surface: pygame.Surface = forecast,
              place: str = 'center'):
    text_img = font.render(text, True, text_col)
    blitloc = text_img.get_rect()
    if place == 'center':
        blitloc.center = (int(x), int(y))
    elif place == 'topleft':
        blitloc.topleft = (int(x), int(y))
    elif place == 'topright':
        blitloc.topright = (int(x), int(y))
    elif place == 'bottomleft':
        blitloc.bottomleft = (int(x), int(y))
    elif place == 'bottomright':
        blitloc.bottomright = (int(x), int(y))
    else:
        raise TypeError('You need to specify a place to blit text')
    surface.blit(text_img, blitloc)


def get_icon(description: str, is_day: bool = True, get_background: bool = False, get_color_theme: bool = False) -> Union[tuple[int, int, int], pygame.Surface, bool]:

    try:
        if 'Mostly Sunny' in description or 'Partly Cloudy' in description or 'Mostly Clear' in description or 'Mostly Cloudy' in description:
            if is_day:
                icon = pygame.image.load(
                    './weather/partsun_d.png').convert_alpha()
                bg = (175, 185, 222)
                lightmode = True
            else:
                icon = pygame.image.load(
                    './weather/partsun_n.png').convert_alpha()
                bg = (67, 72, 89)
                lightmode = False

        elif 'Snow' in description or 'Blizzard' in description or 'Flurries' in description:
            icon = pygame.image.load(
                './weather/snow.png').convert_alpha()
            bg = (215, 217, 222)
            lightmode = True
            if not 'sleet' in description.lower():
                # print('❄️'
                pass
        # elif 'Snow' in description or 'Blizzard' in description or 'Flurries' in description or 'Sleet' in description:
        #     icon = pygame.image.load(
        #         './weather/snow.png').convert_alpha()
        #     bg = (215, 217, 222)
        #     lightmode = True
        #     if not 'sleet' in description.lower():
        #         print('❄️')

        elif 'Thunder' in description:
            icon = pygame.image.load(
                './weather/thunder.png').convert_alpha()
            bg = (67, 67, 67)
            lightmode = False

        elif 'Showers' in description or 'Rain' in description or 'Drizzle' in description:
            if 'Sun' in description or 'Partly Cloudy' in description or 'Mostly Sunny' in description:
                if is_day:
                    icon = pygame.image.load(
                        './weather/pcrain_d.png').convert_alpha()
                    bg = (149, 166, 222)
                    lightmode = True
                else:
                    icon = pygame.image.load(
                        './weather/pcrain_n.png').convert_alpha()
                    bg = (68, 74, 94)
                    lightmode = False
            else:
                icon = pygame.image.load(
                    './weather/rain.png').convert_alpha()
                if is_day:
                    bg = (154, 159, 179)
                    lightmode = True
                else:
                    bg = (68, 74, 94)
                    lightmode = False

        elif 'Cloudy' in description or 'Clouds' in description:
            icon = pygame.image.load(
                './weather/cloudy.png').convert_alpha()
            if is_day:
                bg = (167, 168, 171)
                lightmode = True
            else:
                bg = (56, 56, 59)
                lightmode = False

        elif description == 'Sunny' or 'Sunny' in description or 'Sun' in description or 'Clear' in description:
            if is_day:
                icon = pygame.image.load(
                    './weather/sunny_d.png').convert_alpha()
                bg = (166, 192, 237)
                lightmode = True
            else:
                icon = pygame.image.load(
                    './weather/sunny_n.png').convert_alpha()
                bg = (4, 29, 71)
                lightmode = False

        elif 'Mist' in description or 'Fog' in description:
            icon = pygame.image.load('./weather/fog.png').convert_alpha()
            weather = 'fog'
            if is_day:
                bg = (186, 186, 186)
                lightmode = True
            else:
                bg = (110, 110, 110)
                lightmode = False
        else:
            print('ERROR Could not find correct icon for', description)
            icon = pygame.Surface((100, 100))
            icon.fill((175, 175, 175))
            if is_day:
                lightmode = True
                bg = (255, 255, 255)
            else:
                lightmode = False
                bg = (0, 0, 0)

    except:
        print('ERROR Icons not installed')
        icon = pygame.Surface((100, 100))
        icon.fill((175, 175, 175))
        if is_day:
            lightmode = True
            bg = (255, 255, 255)
        else:
            lightmode = False
            bg = (0, 0, 0)

    if get_background:
        return bg
    elif get_color_theme:
        return lightmode
    else:
        return icon


def get_office(loc: list):
    offices = ['GYX', 'ALY', 'BGM', 'BOX', 'BTV', 'BUF', 'CAE', 'CAR', 'CHS', 'CLE', 'CTP', 'GSP', 'AKQ', 'ILM', 'ILN',
               'LWX', 'MHX', 'OKX', 'PBZ', 'PHI', 'RAH', 'RLX', 'RNK', 'ABQ', 'AMA', 'BMX', 'BRO', 'CRP', 'EPZ', 'EWX',
               'FFC', 'FWD', 'HGX', 'HUN', 'JAN', 'JAX', 'KEY', 'LCH', 'LIX', 'LUB', 'LZK', 'MAF', 'MEG', 'MFL', 'MLB',
               'MOB', 'MRX', 'OHX', 'OUN', 'SHV', 'SJT', 'SJU', 'TAE', 'TBW', 'TSA', 'ABR', 'APX', 'ARX', 'BIS', 'BOU',
               'CYS', 'DDC', 'DLH', 'DMX', 'DTX', 'DVN', 'EAX', 'FGF', 'FSD', 'GID', 'GJT', 'GLD', 'GRB', 'GRR', 'ICT',
               'ILX', 'IND', 'IWX', 'JKL', 'LBF', 'LMK', 'LOT', 'LSX', 'MKX', 'MPX', 'MQT', 'OAX', 'PAH', 'PUB', 'RIW',
               'SGF', 'TOP', 'UNR', 'BOI', 'BYZ', 'EKA', 'FGZ', 'GGW', 'HNX', 'LKN', 'LOX', 'MFR', 'MSO', 'MTR', 'OTX',
               'PDT', 'PIH', 'PQR', 'PSR', 'REV', 'SEW', 'SGX', 'SLC', 'STO', 'TFX', 'TWC', 'VEF', 'AER', 'AFC', 'AFG',
               'AJK', 'ALU', 'GUM', 'HPA', 'HFO', 'PPG', 'STU', 'NH1', 'NH2', 'ONA', 'ONP']
    office = 0
    for i in range(len(offices)):
        url = f'https://api.weather.gov/gridpoints/{offices[i]}/{loc[0]},{loc[1]}/forecast'
        test = requests.get(url)
        if test.status_code == 200:
            office = offices[i]
            break
    if office == 0:
        print('ERROR could not find correct office for', loc[0], ',', loc[1])
    return office


def update_sidebar(image: pygame.Surface = sidebar):
    global screen
    background = pygame.Surface(
        (image.get_width(), image.get_height()), pygame.SRCALPHA)
    if not lightmode:
        background.fill((0, 0, 0))
    else:
        background.fill((255, 255, 255))
    background.set_alpha(100)
    image.blit(background, (0, 0))
    # pygame.draw.rect(image, (pygame.transform.average_color(screen)), pygame.Rect(
    #     10, 10, image.get_width()-10, image.get_height()-10), 0, 10)
    for i in range(len(locations)):
        draw_text(locations[i][2],
                  fontsmall, textcol, 10, 20, image, 'topleft')


def refresh(loc: list, image: pygame.Surface = forecast):
    global bg, lightmode, locationPickerRectCol, textcol, pickingLocation, text, needToUpdate, locationName

    url_point = f'https://api.weather.gov/points/{loc[0]},{loc[1]}'
    point = requests.get(url_point)
    if point.status_code == 200:
        pointdata = point.json()
    else:
        print('error fetching data')
        print(point.status_code)
        print(url_point)
        raise Exception(''.join(
            ['Could not get data. Status code ', str(point.status_code), '. Try again, or use a different location.']))
    url_forecast = pointdata['properties']['forecast']
    url_hourly = pointdata['properties']['forecastHourly']
    locationName = pointdata['properties']['relativeLocation']['properties']['city']

    forecast = requests.get(url_forecast)
    hourly = requests.get(url_hourly)

    if forecast.status_code == 200:
        data = forecast.json()
        properties = data['properties']
        periods = properties['periods']
        temp = periods[0]['temperature']

        data_h = hourly.json()
        properties_h = data_h['properties']
        periods_h = properties_h['periods']
        print('Collected data for', loc, get_office(loc))

        printdata = False
        if printdata:
            print('Forecast: ', periods)
            print('Hourly: ', periods_h)
    else:
        print('error fetching data')
        print(forecast.status_code)
        print(url_forecast)
        raise Exception(''.join(
            ['Could not get data. Status code ', str(forecast.status_code), '. Try again, or use a different location.']))

    # set color theme and background
    lightmode = get_icon(periods[0]['shortForecast'],
                         periods[0]['isDaytime'], get_color_theme=True)
    bg = get_icon(periods[0]['shortForecast'], periods[0]
                  ['isDaytime'], get_background=True)

    if lightmode:
        textcol = (0, 0, 0)
    else:
        textcol = (255, 255, 255)

    # if periods[0]['isDaytime']:
    #     textcol = (0, 0, 0)
    #     bg = (255, 255, 255)
    #     locationPickerRectCol = (235, 235, 235)
    #     lightmode = True

    # else:
    #     textcol = (255, 255, 255)
    #     bg = (0, 0, 0)
    #     locationPickerRectCol = (20, 20, 20)
    #     lightmode = False

    fontresized = fontsmall
    interforesize = 20
    # make image
    image.fill(bg)  # type: ignore

    # Current weather
    draw_text(''.join([str(temp), '°']), fontbig, textcol,
              forecast_width / 2 - 100, 100)

    if fontresized.size(periods[0]['detailedForecast'])[0] < forecast_width:
        draw_text(periods[0]['detailedForecast'], fontresized, textcol,
                  forecast_width / 2, 180)
    else:
        while fontresized.size(periods[0]['detailedForecast'])[0] > forecast_width:
            fontresized = pygame.font.Font(
                'Inter-Light.ttf', interforesize - 1)
            interforesize -= 1

        draw_text(periods[0]['detailedForecast'], fontresized, textcol,
                  forecast_width / 2, 180)

    if str(periods[0]['probabilityOfPrecipitation']['value']) == 'None':
        draw_text('0% rain', fontsmall, textcol, forecast_width / 2 + 20, 100)
    else:
        draw_text(''.join([str(periods[0]['probabilityOfPrecipitation']['value']), '%', ' rain']), fontsmall, textcol,
                  forecast_width / 2 + 20, 100)
    image.blit(get_icon(periods[0]['shortForecast'],
               periods[0]['isDaytime']), (forecast_width / 2 - 250, 50))  # type: ignore

    # Daily forecast
    for i in range(13):
        z = i + 1
        draw_text(''.join([periods[z]['name'], '  ', str(int(''.join([periods[z]['startTime'][5], periods[z]['startTime'][6]]))), '-', str(
            int(''.join([periods[z]['startTime'][8], periods[z]['startTime'][9]])))]), fontsmall, textcol, forecast_width / 4, 230 + z * 50)
        draw_text(''.join([str(periods[z]['temperature']), '°']), fontsmall, textcol, forecast_width / 4 + 150,
                  230 + z * 50)

        if str(periods[z]['probabilityOfPrecipitation']['value']) == 'None':
            draw_text('0%', fontsmall, textcol,
                      forecast_width / 4 + 220, 230 + z * 50)
        else:
            draw_text(''.join([str(periods[z]['probabilityOfPrecipitation']['value']),
                               '%']), fontsmall, textcol, forecast_width / 4 + 220, 230 + z * 50)

        image.blit(
            pygame.transform.scale(
                get_icon(periods[z]['shortForecast'], periods[z]['isDaytime']), (40, 40)),  # type: ignore
            (forecast_width / 4 + 270, 210 + z * 50))

    # Hourly forecast
    for h in range(156):
        draw_text(convert_date(periods_h[h]['startTime']), fontsmall, textcol,
                  forecast_width / 4, 950 + h * 50)
        # draw_text(''.join(
        #     [periods_h[h]['startTime'][5], periods_h[h]['startTime'][6], periods_h[h]['startTime'][7],
        #      periods_h[h]['startTime'][8], periods_h[h]['startTime'][9], ' ', periods_h[h]['startTime'][11],
        #      str(periods_h[h]['startTime'][12]), str(
        #          periods_h[h]['startTime'][13]),
        #      str(periods_h[h]['startTime'][14]), str(periods_h[h]['startTime'][15])]), intersmall, textcol,
        #     forecast_width / 4, 950 + h * 50)

        draw_text(''.join([str(periods_h[h]['temperature']), '°']), fontsmall, textcol, forecast_width / 4 + 150,
                  950 + h * 50)

        if str(periods_h[h]['probabilityOfPrecipitation']['value']) == 'None':
            draw_text('0%', fontsmall, textcol,
                      forecast_width / 4 + 220, 950 + h * 50)
        else:
            draw_text(''.join([str(periods_h[h]['probabilityOfPrecipitation']['value']),
                               '%']), fontsmall, textcol, forecast_width / 4 + 220, 950 + h * 50)

        image.blit(
            pygame.transform.scale(
                get_icon(periods_h[h]['shortForecast'], periods_h[h]['isDaytime']), (40, 40)),  # type: ignore
            (forecast_width / 4 + 270, 930 + h * 50))

    pygame.display.set_caption(
        ''.join([str(periods[0]['temperature']), '° ', periods[0]['shortForecast']]))
    pygame.display.set_icon(
        get_icon(periods[0]['shortForecast'], periods[0]['isDaytime']))  # type: ignore

    pickingLocation = 0

    # set typed text to none
    text = ''

    # Update screen
    pygame.display.update()


def get_item(mouse_pos: tuple[int, int], scroll_amount: int):
    for i in range(13):
        z = i + 1
        if 210 + (z + 1) * 50 + scroll_amount > mouse_pos[1] > 210 + z * 50 + scroll_amount:
            print('CLICKED!', z)


def convert_date(time: str):

    if time[5] == 0:
        date_month = int(time[6])
    else:
        date_month = int(''.join([time[5], time[6]]))

    if time[9] == 0:
        date_day = int(time[10])
    else:
        date_day = int(''.join([time[8], time[9]]))

    time_hr = str(int(''.join([time[11], time[12]])))
    # time_min = ''.join([time[14], time[15]])
    time_min = ''

    if int(time_hr) > 12:
        time_hr = str(int(time_hr) - 12)
        PM = ' pm'
    else:
        PM = ' am'

    return_time = ''.join(
        [str(date_month), '-', str(date_day), ' ', str(time_hr), PM])

    return return_time


refresh(location, forecast)
with open('0name', 'w') as f:
    f.write(locationName)
    f.close()

scroll = 0

run = True
clock = pygame.time.Clock()
FPS = 10

text = ''
update_sidebar()

while run:
    # clock.tick(FPS)
    # update_sidebar()
    pos = pygame.mouse.get_pos()
    key = pygame.key.get_pressed()
    screen.fill(bg)
    screen.blit(forecast, (310, scroll))

    screen.blit(sidebar, (0, 0))

    # Update location
    if screen_width / 2 + 150 > pos[0] > screen_width / 2 - 150 and 60 > pos[1] > 10:
        if clicked and pickingLocation == 0:
            pickingLocation = 1
            needToUpdate = True
            text = ''
    else:
        if clicked:
            get_item(pos, scroll)

    # if pickingLocation == 0:
    #     draw_text('Locations', fontsmall, textcol, locationPickerRect.centerx,
    #               locationPickerRect.centery, screen, 'center')
    #     # draw_text(', '.join([str(location[0]), str(location[1])]), intersmall, textcol, locationPickerRect.centerx,
    #     #           locationPickerRect.centery, screen, 'center')
    if pickingLocation == 1:
        draw_text(''.join(['Latitude: ', text, '|']), fontsmall, textcol,
                  locationPickerRect.centerx, locationPickerRect.centery, screen, 'center')
        needToUpdate = True
    elif pickingLocation == 2:
        draw_text(''.join(['Longitude: ', text, '|']), fontsmall, textcol,
                  locationPickerRect.centerx, locationPickerRect.centery, screen, 'center')
        needToUpdate = True

    if key[pygame.K_UP] and scroll < 0:
        scroll += 2
    if key[pygame.K_DOWN] and scroll > -8200:
        scroll -= 2

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
            needToUpdate = True
        if event.type == pygame.MOUSEWHEEL:
            if not scroll <= -8200 and not scroll >= 0:
                scroll += event.precise_y * 4

            elif scroll <= -8200:
                if event.precise_y > 0:
                    scroll += event.precise_y * 4
            else:
                if event.precise_y < 0:
                    scroll += event.precise_y * 4
            needToUpdate = True

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r and (key[pygame.K_LMETA] or key[pygame.K_RMETA] or key[pygame.K_LCTRL] or key[pygame.K_RCTRL]):
                pygame.display.set_caption('Loading...')
                refresh(location, forecast)
                needToUpdate = True

            if event.key == pygame.K_UP and (key[pygame.K_LMETA] or key[pygame.K_RMETA] or key[pygame.K_LCTRL] or key[pygame.K_RCTRL]):
                scroll = 0
            if event.key == pygame.K_DOWN and (key[pygame.K_LMETA] or key[pygame.K_RMETA] or key[pygame.K_LCTRL] or key[pygame.K_RCTRL]):
                scroll = -8200

            if event.key == pygame.K_RETURN:
                pickingLocation += 1

                if pickingLocation == 2:
                    location[0] = abs(float(text))
                    needToUpdate = True
                elif pickingLocation == 3:
                    location[1] = abs(float(text))
                    needToUpdate = True
                    pickingLocation = 0
                    refresh(location, forecast)

                needToUpdate = True

                text = ''

            # Backspace key
            if event.key == pygame.K_BACKSPACE or event.key == pygame.K_DELETE:
                textlist = list(text)
                textlist.pop()
                text = ''.join(textlist)
                del textlist

        if event.type == pygame.TEXTINPUT:
            text = ''.join([text, event.text])
            print(text)
            needToUpdate = True

        # Window resizing
        if event.type == pygame.VIDEORESIZE:
            screen_width = event.dict['size'][0]
            screen_height = event.dict["size"][1]
            print(screen_width, screen_height)
            pygame.display.update()
            print(event.dict['size'])

        elif event.type == pygame.VIDEOEXPOSE:  # handles window minimising/maximising
            screen.fill((0, 0, 0))
            pygame.display.update()

        if clicked:
            clicked = False
        if event.type == pygame.MOUSEBUTTONUP:
            clicked = True

    pygame.display.update()

pygame.QUIT
sys.exit()
