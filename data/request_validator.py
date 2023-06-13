import re
__author__ = "Michael Pogrebinsky - www.topdeveloperacademy.com"


class CreditCardValidationException(Exception):
    pass


class InvalidBillingInfo(Exception):
    pass


class RequestValidator:
    """
    Purchase Request Validation Logic
    DO NOT MODIFY THIS CLASS
    """

    def __init__(self):
        self.stolen_credit_cards = {"1111111111111111", "9999888877776666"}

    def validate_credit_card(self, credit_card_number: str):
        """Validates the credit card number"""

        if not credit_card_number or not credit_card_number.strip():
            raise CreditCardValidationException("Credit card must not be empty")

        if re.fullmatch("[0-9]{16}", credit_card_number) is None:
            raise CreditCardValidationException("A credit card should be a 16 digit number")

        if credit_card_number in self.stolen_credit_cards:
            raise CreditCardValidationException(f"The credit {credit_card_number} is banned")

    @staticmethod
    def validate_billing_info(first_name: str, last_name: str, billing_address: str):
        """Validates the billing information"""

        if not first_name or not first_name.strip():
            raise InvalidBillingInfo("First name must not be empty")
        if not last_name or not last_name.strip():
            raise InvalidBillingInfo("Last name must not be empty")
        if not billing_address or not billing_address.strip():
            raise InvalidBillingInfo("Billing address must not be empty")
