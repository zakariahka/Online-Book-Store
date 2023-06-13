# This is the BUILD target, do not remove it, and do not modify it's name
.PHONY: flask-build
flask-build:
	pip install -r requirements.txt

# This is the RUN target, do not remove it, and do not modify it's name
flask-run:
	PYTHONUNBUFFERED=1 FLASK_ENV=development flask run --host=0.0.0.0 --port=8080 2>&1 | tee $$LOG_TO /dev/stdout &
.PHONY: flask-run

# This is the STOP target, do not remove it, and do not modify it's name
flask-stop:
	kill `ps auxf | grep 'flask run --host=0.0.0.0 --port=8080' | grep -v grep | awk '{print $$2}'` 2>/dev/null || true
.PHONY: flask-stop

# This is the RESTART target, do not remove it, and do not modify it's name
flask-restart: flask-stop flask-run
.PHONY: flask-restart
