from django.db import models


# Create your models here.


class Company(models.Model):
    type = models.CharField(max_length=10, verbose_name="企业类型")
    cname = models.CharField(max_length=255, verbose_name="企业名称")
    adress = models.CharField(max_length=255, verbose_name="企业地址")
    name = models.CharField(max_length=20, verbose_name="联系人")
    mobile = models.CharField(max_length=20, verbose_name="电话")
    introduction = models.TextField(max_length=1000, verbose_name="企业介绍")
    service = models.TextField(max_length=1000, verbose_name="产品服务介绍")
    credit = models.TextField(max_length=1000, verbose_name="荣誉与资质")
    financing = models.TextField(max_length=1000, verbose_name="融资情况")
    profit = models.TextField(max_length=1000, verbose_name="营收情况")
    img = models.ImageField(upload_to='upload', verbose_name="logo")

    class Meta:
        verbose_name = u"调查信息"
        verbose_name_plural = verbose_name

    def logo_image(self):
        return '<img src="/media/%s" style="height:100px"/>' % self.img

    logo_image.allow_tags = True

    logo_image.short_description = '企业logo'

