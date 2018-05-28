from django.contrib import admin

# Register your models here.
from app01.models import Company



@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('cname', 'type',  'adress', 'name', 'mobile', 'logo_image')

    list_filter = ('type',)
    search_fields = ('id', 'type', 'cname', 'name', 'mobile')  # 搜索字段

    list_per_page = 50

    ordering = ('id',)

    readonly_fields = ('logo_image','id', 'type', 'cname', 'adress', 'name', 'mobile',
                       'introduction', 'service', 'credit', 'financing', 'profit', 'img')

admin.site.site_header = "浙江省大数据科技协会"
admin.site.site_title = "星河奖"