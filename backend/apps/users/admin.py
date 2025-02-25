from django.contrib import admin
from apps.users.models import UserProfile
from apps.destinations.models import *
from apps.packages.models import *
from apps.transactions.models import *

admin.site.register(UserProfile)

admin.site.register(DestinationType)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(Destination)

admin.site.register(AdditionalFees)
admin.site.register(Booking)
admin.site.register(Transaction)
admin.site.register(PackageReview)

admin.site.register(PackageImage)
admin.site.register(Package)
admin.site.register(PackageAmenity)
admin.site.register(PackageType)
