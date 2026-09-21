from django import forms


class SignupForm(forms.Form):
    """Extra signup fields for allauth (`ACCOUNT_SIGNUP_FORM_CLASS`).

    Only names are collected here. Email and password are handled by allauth itself, and nothing
    role-related is accepted.
    """

    first_name = forms.CharField(max_length=150)
    last_name = forms.CharField(max_length=150)

    def signup(self, request, user):
        user.first_name = self.cleaned_data["first_name"].strip()
        user.last_name = self.cleaned_data["last_name"].strip()
        user.save(update_fields=["first_name", "last_name"])
