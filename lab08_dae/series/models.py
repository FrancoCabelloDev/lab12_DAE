from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Serie(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='series')
    imagen = models.ImageField(upload_to='series/', blank=True, null=True)  # Cambia a ImageField

    def __str__(self):
        return self.nombre
