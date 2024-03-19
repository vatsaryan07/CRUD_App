FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /crudBackend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 

RUN ls


COPY . /crudBackend/


CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]