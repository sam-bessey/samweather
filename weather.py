import sys

import pygame
import requests

pygame.init()

screen_width = 900
screen_height = 700
screen = pygame.display.set_mode((screen_width, screen_height))

info = pygame.Surface((screen_width, 9000))

interbig = pygame.font.Font('Inter-Light.ttf', 65)
intermid = pygame.font.Font('Inter-Light.ttf', 50)
intersmall = pygame.font.Font('Inter-Light.ttf', 20)

bg = (255, 255, 255)
locationPickerRectCol = (235, 235, 235)
isday = True

location = [44, 70]
textcol = (0, 0, 0)

locationPickerRect = pygame.Rect(0, 0, 300, 50)
locationPickerRect.centerx = (screen_width / 2)
locationPickerRect.top = 10

clicked = False

needToUpdate = True


def draw_text(text: str, font: pygame.font.Font, text_col: [int, int, int], x: float, y: float,
              surface: pygame.Surface = info,
              place: str = 'center'):
    text_img = font.render(text, True, text_col)
    blitloc = text_img.get_rect()
    if place == 'center':
        blitloc.center = (x, y)
    elif place == 'topleft':
        blitloc.topleft = (x, y)
    elif place == 'topright':
        blitloc.topright = (x, y)
    elif place == 'bottomleft':
        blitloc.bottomleft = (x, y)
    elif place == 'bottomright':
        blitloc.bottomright = (x, y)
    else:
        raise TypeError('You need to specify a place to blit text')
    surface.blit(text_img, blitloc)


def get_icon(description: str, is_day: bool = True):
    if 'Thunder' in description:
        icon = pygame.image.load('./icons/thunder.png').convert_alpha()

    elif 'Showers' in description or 'Rain' in description:
        if 'Sun' in description or 'Partly Cloudy' in description or 'Mostly Sunny' in description:
            if is_day:
                icon = pygame.image.load('./icons/pcrain_d.png').convert_alpha()
            else:
                icon = pygame.image.load('./icons/pcrain_n.png').convert_alpha()
        else:
            icon = pygame.image.load('./icons/rain.png').convert_alpha()

    elif 'Mostly Sunny' in description or 'Partly Cloudy' in description or 'Mostly Clear' in description:
        if is_day:
            icon = pygame.image.load('./icons/partsun_d.png').convert_alpha()
        else:
            icon = pygame.image.load('./icons/partsun_n.png').convert_alpha()

    elif 'Snow' in description or 'Blizzard' in description or 'Flurries' in description:
        icon = pygame.image.load('./icons/snow.png').convert_alpha()

    elif 'Cloudy' in description or 'Clouds' in description:
        icon = pygame.image.load('./icons/cloudy.png').convert_alpha()

    elif description == 'Sunny' or 'Sunny' in description or 'Sun' in description or 'Clear' in description:
        if is_day:
            icon = pygame.image.load('./icons/sunny_d.png').convert_alpha()
        else:
            icon = pygame.image.load('./icons/sunny_n.png').convert_alpha()

    elif 'Mist' in description or 'Fog' in description:
        icon = pygame.image.load('./icons/fog.png').convert_alpha()

    else:
        print('ERROR Could not find correct icon for', description)
        icon = pygame.Surface((100, 100))
        icon.fill((175, 175, 175))

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


def refresh(loc: list, image: pygame.Surface = info):
    global bg, intersmall, interbig, intermid, isday, locationPickerRectCol, textcol

    url = f'https://api.weather.gov/gridpoints/{get_office(loc)}/{loc[0]},{loc[1]}/forecast'
    url_hourly = f'https://api.weather.gov/gridpoints/{get_office(loc)}/{loc[0]},{loc[1]}/forecast/hourly'

    forecast = requests.get(url)
    hourly = requests.get(url_hourly)

    if forecast.status_code == 200:
        data = forecast.json()
        properties = data['properties']
        periods = properties['periods']
        temp = periods[0]['temperature']
        print(data)

        data_h = hourly.json()
        properties_h = data_h['properties']
        periods_h = properties_h['periods']
        print('Hourly:', data_h)
    else:
        print('error fetching data')
        print(forecast.status_code)
        raise Exception(''.join(
            ['Could not fetch data. Status code ', forecast.status_code, '. Try again, or use a different location.']))

    if periods[0]['isDaytime']:
        textcol = (0, 0, 0)
        bg = (255, 255, 255)
        locationPickerRectCol = (235, 235, 235)
        isday = True
    else:
        textcol = (255, 255, 255)
        bg = (0, 0, 0)
        locationPickerRectCol = (20, 20, 20)
        isday = False

    interforforecast = intersmall
    interforesize = 20
    # make image
    image.fill(bg)
    draw_text(''.join([str(temp), '°']), interbig, textcol,
              screen_width / 2 - 100, 100)

    # draw_text(periods[0]['detailedForecast'], intersmall, textcol,
    #           screen_width / 2, 180)

    if interforforecast.size(periods[0]['detailedForecast'])[0] < screen_width:
        draw_text(periods[0]['detailedForecast'], interforforecast, textcol,
                  screen_width / 2, 180)
    else:
        while interforforecast.size(periods[0]['detailedForecast'])[0] > screen_width:
            interforforecast = pygame.font.Font('Inter-Light.ttf', interforesize - 1)
            interforesize -= 1
        draw_text(periods[0]['detailedForecast'], interforforecast, textcol,
                  screen_width / 2, 180)

    if str(periods[0]['probabilityOfPrecipitation']['value']) == 'None':
        draw_text('0% rain', intersmall, textcol, screen_width / 2 + 20, 100)
    else:
        draw_text(''.join([str(periods[0]['probabilityOfPrecipitation']['value']), '%', ' rain']), intersmall, textcol,
                  screen_width / 2 + 20, 100)
    image.blit(get_icon(periods[0]['shortForecast'], periods[0]['isDaytime']), (screen_width / 2 - 250, 50))

    # Daily forecast
    for i in range(13):
        z = i + 1
        draw_text(periods[z]['name'], intersmall, textcol, screen_width / 4, 230 + z * 50)
        draw_text(''.join([str(periods[z]['temperature']), '°']), intersmall, textcol, screen_width / 4 + 150,
                  230 + z * 50)

        if str(periods[z]['probabilityOfPrecipitation']['value']) == 'None':
            draw_text('0%', intersmall, textcol, screen_width / 4 + 220, 230 + z * 50)
        else:
            draw_text(''.join([str(periods[z]['probabilityOfPrecipitation']['value']),
                               '%']), intersmall, textcol, screen_width / 4 + 220, 230 + z * 50)

        image.blit(
            pygame.transform.scale(get_icon(periods[z]['shortForecast'], periods[z]['isDaytime']), (40, 40)),
            (screen_width / 4 + 270, 210 + z * 50))

    # Hourly forecast
    for h in range(156):
        draw_text(''.join(
            [periods_h[h]['startTime'][5], periods_h[h]['startTime'][6], periods_h[h]['startTime'][7],
             periods_h[h]['startTime'][8], periods_h[h]['startTime'][9], ' ', periods_h[h]['startTime'][11],
             str(periods_h[h]['startTime'][12]), str(periods_h[h]['startTime'][13]),
             str(periods_h[h]['startTime'][14]), str(periods_h[h]['startTime'][15])]), intersmall, textcol,
            screen_width / 4, 950 + h * 50)

        draw_text(''.join([str(periods_h[h]['temperature']), '°']), intersmall, textcol, screen_width / 4 + 150,
                  950 + h * 50)

        if str(periods_h[h]['probabilityOfPrecipitation']['value']) == 'None':
            draw_text('0%', intersmall, textcol, screen_width / 4 + 220, 950 + h * 50)
        else:
            draw_text(''.join([str(periods_h[h]['probabilityOfPrecipitation']['value']),
                               '%']), intersmall, textcol, screen_width / 4 + 220, 950 + h * 50)

        image.blit(
            pygame.transform.scale(get_icon(periods_h[h]['shortForecast'], periods_h[h]['isDaytime']), (40, 40)),
            (screen_width / 4 + 270, 930 + h * 50))

    pygame.display.set_caption(''.join([str(periods[0]['temperature']), '° ', periods[0]['shortForecast']]))
    pygame.display.set_icon(get_icon(periods[0]['shortForecast'], periods[0]['isDaytime']))


def get_item(mouse_pos: tuple[int, int], scroll_amount: int):
    for i in range(13):
        z = i + 1
        if 210 + (z + 1) * 50 + scroll_amount > mouse_pos[1] > 210 + z * 50 + scroll_amount:
            print('CLICKED!', z)


refresh(location, info)

scroll = 0

run = True
clock = pygame.time.Clock()
FPS = 10

while run:
    # clock.tick(FPS)
    pos = pygame.mouse.get_pos()
    key = pygame.key.get_pressed()
    screen.fill(bg)
    screen.blit(info, (0, scroll))

    pygame.draw.rect(screen, locationPickerRectCol, locationPickerRect, 0, 10)

    # Update location picker
    if screen_width / 2 + 150 > pos[0] > screen_width / 2 - 150 and 60 > pos[1] > 10:
        if isday:
            locationPickerRectCol = (215, 215, 215)
        else:
            locationPickerRectCol = (40, 40, 40)
        if clicked:
            pass
    else:
        if isday:
            locationPickerRectCol = (225, 225, 225)
        else:
            locationPickerRectCol = (20, 20, 20)

        if clicked:
            get_item(pos, scroll)


    draw_text(', '.join([str(location[0]), str(location[1])]), intersmall, textcol, locationPickerRect.centerx,
              locationPickerRect.centery, screen, 'center')

    # update scroll

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
            needToUpdate = True
        if event.type == pygame.MOUSEWHEEL:
            if not scroll <= -8200 and not scroll >= 0:
                scroll += event.y * 10
            elif scroll <= -8200:
                if event.y > 0:
                    scroll += event.y * 10
            else:
                if event.y < 0:
                    scroll += event.y * 10
            needToUpdate = True

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r:
                pygame.display.set_caption('Loading...')
                refresh(location, info)
                needToUpdate = True

        if clicked:
            clicked = False
        if event.type == pygame.MOUSEBUTTONUP:
            clicked = True

    if needToUpdate:
        pygame.display.update()
        needToUpdate = False
    else:
        pygame.display.update(locationPickerRect)

fj = pygame.QUIT
sys.exit()
