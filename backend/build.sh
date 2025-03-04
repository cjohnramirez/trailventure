#!/usr/bin/env bash

echo "Building project packages ... "
python3.9 -m pip install -r requirements.txt

echo "Migrating Database ... "
python3.9 manage.py makemigrations --noinput
python3.9 manage.py migrate --noinput

echo "Collecting static files ... "
python3.9 manage.py collectstatic --noinput