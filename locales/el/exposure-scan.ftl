exposure-landing-hero-heading = Μάθετε εάν έχουν παραβιαστεί οι προσωπικές σας πληροφορίες
exposure-landing-hero-email-label = Διεύθυνση email
exposure-landing-hero-cta-label = Έλεγχος για παραβιάσεις
exposure-landing-result-loading = Φόρτωση, παρακαλώ περιμένετε…
# Variables:
#   $email (string) - The user's email address, used to identify their data in breaches
#   $count (number) - Number of data breaches in which the user's data was found
exposure-landing-result-hero-heading =
    { $count ->
        [one] Βρήκαμε το <email>{ $email }</email> σε <count>1</count> παραβίαση δεδομένων.
       *[other] Βρήκαμε το <email>{ $email }</email> σε <count>{ $count }</count> παραβιάσεις δεδομένων.
    }
exposure-landing-result-card-nothing = Δεν βρέθηκαν παραβιάσεις
exposure-landing-result-none-footer-cta-label = Εγγραφή για ειδοποιήσεις