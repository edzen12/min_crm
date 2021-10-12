import os
import uuid


def generate_document_filename(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f'{str(uuid.uuid4())}.{ext}'
    return os.path.join('files', new_filename)


def generate_image_filename(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f'{str(uuid.uuid4())}.{ext}'
    return os.path.join('images', new_filename)
