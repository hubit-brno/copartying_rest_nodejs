# rest api v1
### `GET /api/v1/coparties` - list
Return list of all coparties.

### `POST /api/v1/coparties` - create
Create new coparty.
##### request data
```javascript
{
  "coparty": {
    "id": "",                       // string - id
    "name": "",                     // string
    "description": "",              // string
    "date": "",                     // string - Date ISO 8601
    "place": "",                    // string
    "expected_number": 0,           // number - expected number of participants
    "items": [                      // list of items
      {
        "id": "",                     // string - id
        "name": "",                   // string
        "description": "",            // string
        "package_size": "",           // string - package size
        "count": 0                    // number - required number of packages
      },      
    ]
  }
}
```

### `GET /api/v1/coparties/:id` - show
Get one coparty.

### `PUT /api/v1/coparties/:id` - update
Update specified coparty. Always rewrite whole object.
#### request data
the same as create

### `POST /api/v1/coparties/:copartyId/items/:itemId` - assign user to list
Assign user to item.
#### request data
```javascript
{
  "user": {
    "name": "",                     // string - name of user (fullname or nick)
    "email": "",                    // string - user's email address
    "count": 0                      // numbert - number of packages
  }
}

```
