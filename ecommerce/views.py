from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model

from .forms import ContactForm, LoginForm, RegisterForm

def home_page(request):
	context = {
	"title":"welcome to the home page"
	}
	if request.user.is_authenticated:
		context["premium_content"] = "yeahhh"
	return render(request, "home_page.html", context)

def about_page(request):
	context = {
	"title":"welcome to the about page"
	}
	return render(request, "home_page.html", context)

def contact_page(request):
	contact_form = ContactForm(request.POST or None)
	context = {
	"title":"welcome to the Contact page",
	"form" : contact_form
	}
	if contact_form.is_valid():
		print(contact_form.cleaned_data)
	print(request.POST)
	return render(request, "contact/view.html", context)

def login_page(request):
	form = LoginForm(request.POST or None)
	context = {
	"form" : form
	}
	if form.is_valid():
		print(form.cleaned_data)
		username = form.cleaned_data.get("username")
		password = form.cleaned_data.get("password")
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			print(user.is_authenticated())
			# context['form'] = LoginForm()
			redirect("login/")
		else:
			print("Error")

	return render(request, "auth/login.html", context)


User = get_user_model()
def register_page(request):
	form = RegisterForm(request.POST or None)
	context = {
	"form" : form
	}
	if form.is_valid():
		print(form.cleaned_data)
		username = form.cleaned_data.get("username")
		email = form.cleaned_data.get("email")
		password = form.cleaned_data.get("password")
		new_user = User.objects.create_user(username, email, password)
		print(new_user)
    
	return render(request, "auth/register.html", context)