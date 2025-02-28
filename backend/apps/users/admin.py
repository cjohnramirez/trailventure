from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

from apps.destinations.models import *
from apps.packages.models import *
from apps.transactions.models import *
from apps.users.models import *

admin.site.register(User)
admin.site.register(HostProfile)
admin.site.register(CustomerProfile)

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
admin.site.register(PackageTypeAmenity)
admin.site.register(PackageType)
admin.site.register(PackageRoutePoint)
