# FROM python:3.8-buster
FROM python:3.9.17-buster

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    torch torchvision torchaudio \
    transformers \
    Pillow \
    numpy \
    tqdm \
    matplotlib \
    kafka-python \
    opencv-python-headless \
    ultralytics

COPY . .

CMD ["python", "-u", "app.py"]
