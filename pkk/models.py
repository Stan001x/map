from django.db import models
from django.urls import reverse


class Regions(models.Model):
    region_rus_name1 = models.CharField(max_length=50)
    slug = models.SlugField(max_length=255, blank=True, db_index=True, default='')
    region_rus_name2 = models.CharField(max_length=50)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lng = models.DecimalField(max_digits=9, decimal_places=6)
    is_published = models.BooleanField(default=True)


    def __str__(self):
        return self.region_rus_name1

    class Meta:
        verbose_name = "Список регионов"
        verbose_name_plural = "Список регионов"
        ordering = ['region_rus_name1']

    def get_absolute_url(self):
        return reverse('regions', kwargs={'regions_slug':self.slug})

