// Payment settings: Paystack Payment Pages, paid into Intelligent Games 4U Limited's bank.
//
// Set-up (Paystack dashboard > Payments > Payment Pages > New page):
//
// 1. Game unlock: choose "Product" / one-time payment, enter the price in NGN.
//    Under "Extra settings" set "Redirect after payment" to
//      https://YOUR-SITE/unlocked.html
//    so level 3 unlocks when the player returns.
//    Copy the page link (https://paystack.com/pay/...) into unlockLink.
//
// 2. Donations: new page, leave the amount blank so givers choose how much.
//    Optionally redirect to https://YOUR-SITE/#donate.
//    Copy its link into donateLink.
//
// Both pages belong to the same Paystack account, so both settle to the same bank.
// Leave a link empty ('') and its button shows "coming soon" instead.
window.IG4U_CONFIG = {
  unlockLink: '',
  unlockPrice: '₦2,000',
  donateLink: ''
};
