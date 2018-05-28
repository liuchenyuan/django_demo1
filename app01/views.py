from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from app01.models import Company


def index(request):
    return render(request, "index.html")

def apply(request):
    if request.method == "POST":

        message = Company(
            type="优秀应用",
            cname=request.POST.get("cname"),
            adress=request.POST.get("adress"),
            name=request.POST.get("name"),
            mobile=request.POST.get("mobile"),
            introduction=request.POST.get("introduction"),
            service=request.POST.get("service"),
            credit=request.POST.get("credit"),
            financing=request.POST.get("financing"),
            profit=request.POST.get("profit"),
            img=request.FILES.get("img")
        )
        message.save()
        return redirect("/")
    else:
        return render(request, "apply.html")

def innovation(request):
    if request.method == "POST":

        message = Company(
            type="技术创新",
            cname=request.POST.get("cname"),
            adress=request.POST.get("adress"),
            name=request.POST.get("name"),
            mobile=request.POST.get("mobile"),
            introduction=request.POST.get("introduction"),
            service=request.POST.get("service"),
            credit=request.POST.get("credit"),
            financing=request.POST.get("financing"),
            profit=request.POST.get("profit"),
            img=request.FILES.get("img")
        )
        message.save()
        return redirect("/")
    else:
        return render(request, "innovation.html")

def page_not_found(request):
    return render(request, '404.html')