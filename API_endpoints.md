# Veiling API Endpoints

## Users
- `GET /api/users`  
  Haal alle gebruikers op  
  Response: JSON array van gebruikers

- `GET /api/users/{user_id}`  
  Haal specifieke gebruiker op  
  Response: JSON gebruiker object

- `POST /api/users`  
  Maak nieuwe gebruiker aan  
  Body: JSON gebruiker data  
  Response: Aangemaakte gebruiker object

## Companies
- `GET /api/companies`  
  Haal alle bedrijven op  
  Response: JSON array van bedrijven

## Auctions
- `GET /api/auctions`  
  Haal alle veilingen op (opties filteren via query params category, status)  
  Response: JSON array van veilingen

- `GET /api/auctions/{auction_id}`  
  Haal specifieke veiling op  
  Response: JSON veiling object

- `POST /api/auctions`  
  Maak veiling aan  
  Body: JSON veiling data  
  Response: Aangemaakte veiling

## Bids
- `POST /api/bids`  
  Plaats nieuw bod  
  Body: JSON bod data (auction_id, bidder_id, amount)  
  Response: Nieuw bod object

- `GET /api/bids/auction/{auction_id}`  
  Haal biedingen van veiling op  
  Response: Array van biedingen

## Contracts
- `GET /api/contracts`  
  Haal contracten op

- `POST /api/contracts`  
  Maak contract aan (na veiling gewonnen)  
  Body: JSON contract details

## Invoices
- `GET /api/invoices`  
  Haal facturen op

- `POST /api/invoices`  
  Maak factuur aan

## Reviews
- `GET /api/reviews`  
  Haal reviews op

- `POST /api/reviews`  
  Voeg review toe

## Offers
- `GET /api/offers`  
  Haal offerte aanvragen op

- `POST /api/offers`  
  Maak nieuwe offerte aanvraag

