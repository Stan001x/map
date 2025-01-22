from django.contrib import admin

from django.db.models import Count

from .models import Regions

@admin.register(Regions)
class RegionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'region_rus_name1', 'slug', 'is_published', 'brief_info')
    list_display_links = ('id', 'region_rus_name1')
    list_editable = ('is_published', )
    prepopulated_fields = {"slug": ("region_rus_name1",)}
    list_per_page = 20
    actions = ['set_published', 'set_draft']
    search_fields = ['region_rus_name1', 'slug']

    @admin.display(description="символов в названии")
    def brief_info(self, regions: Regions):
        return f"Описание {len(regions.region_rus_name1)} символов."

    @admin.action(description='Опубликовать')
    def set_published(self, request, queryset):
        count = queryset.update(is_published=1)
        self.message_user(request, f"Опубликовано {count} записей.")

    @admin.action(description='Снять с публикации')
    def set_draft(self, request, queryset):
        count = queryset.update(is_published=0)
        self.message_user(request, f"Снято с публикации {count} записей.")
