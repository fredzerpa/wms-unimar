// Images
import kal from "assets/images/kal-visuals-square.jpg";
import ivana from "assets/images/ivana-square.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import team5 from "assets/images/team-5.jpg";

export const usersData = [
  {
    "_id": "65319c87fc13ae27f8c76854",
    "imageUrl": team2,
    "email": "reinaldosifontes@gmail.com",
    "names": "reinaldo",
    "lastnames": "sifontes",
    "fullname": "reinaldo sifontes",
    "isAdmin": true,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+1 353 782 6518"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c76855",
    "imageUrl": team3,
    "email": "gaggis1@gmail.com",
    "names": "gillie",
    "lastnames": "aggis",
    "fullname": "gillie aggis",
    "isAdmin": false,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "users": {
        "read": true,
        "upsert": false,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": false,
        "delete": false
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+86 864 118 2021"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c76856",
    "imageUrl": team1,
    "email": "gbeyne2@gmail.com",
    "names": "gabie",
    "lastnames": "beyne",
    "fullname": "gabie beyne",
    "isAdmin": true,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+57 321 499 9737"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c76857",
    "imageUrl": team4,
    "email": "ctyrwhitt3@gmail.com.uk",
    "names": "claire",
    "lastnames": "tyrwhitt",
    "fullname": "claire tyrwhitt",
    "isAdmin": true,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+86 626 996 9579"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c76858",
    "imageUrl": ivana,
    "email": "cwishart4@gmail.com",
    "names": "chrysler",
    "lastnames": "wishart",
    "fullname": "chrysler wishart",
    "isAdmin": false,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": false,
        "delete": false
      }
    },
    "phones": {
      "main": "+63 805 863 5658"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c76859",
    "imageUrl": team5,
    "email": "bdarbon5@gmail.com",
    "names": "blondie",
    "lastnames": "darbon",
    "fullname": "blondie darbon",
    "isAdmin": true,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+58 446 374 6742"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c7685a",
    "imageUrl": kal,
    "email": "gkuhnert6@gmail.com",
    "names": "georgeta",
    "lastnames": "kuhnert",
    "fullname": "georgeta kuhnert",
    "isAdmin": false,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": false,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": false
      }
    },
    "phones": {
      "main": "+509 138 599 4427"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c7685b",
    "imageUrl": team3,
    "email": "dhamblen7@gmail.com",
    "names": "dee",
    "lastnames": "hamblen",
    "fullname": "dee hamblen",
    "isAdmin": false,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "users": {
        "read": true,
        "upsert": false,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": false
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": false
      }
    },
    "phones": {
      "main": "+93 657 252 1108"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c7685c",
    "imageUrl": kal,
    "email": "lmatzke8@gmail.com",
    "names": "lucila",
    "lastnames": "matzke",
    "fullname": "lucila matzke",
    "isAdmin": false,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "users": {
        "read": true,
        "upsert": false,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": false
      },
      "billing": {
        "read": true,
        "upsert": false,
        "delete": false
      }
    },
    "phones": {
      "main": "+86 343 841 2917"
    }
  },
  {
    "_id": "65319c87fc13ae27f8c7685d",
    "imageUrl": team1,
    "email": "pshoebrook9@gmail.com",
    "names": "pooh",
    "lastnames": "shoebrook",
    "fullname": "pooh shoebrook",
    "isAdmin": true,
    "privileges": {
      "reports": {
        "read": true
      },
      "inventory": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "shippings": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "billing": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "phones": {
      "main": "+7 920 139 7234"
    }
  }
]