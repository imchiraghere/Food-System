var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

//////////--------------> Food InterFace <--------------------\\\\\

router.get("/foodface", function (req, res) {
  res.render("foodface", { message: "" });
});

///////////////// ----------> Food Add Items Inertface <-----------------\\\\\\\\\\\\\

router.get("/foodadd", function (req, res) {
  res.render("foodadd", { message: "" });
});

///////////////// ----------> Food Add Items  <-----------------\\\\\\\\\\\\\

router.post("/foodinsert", function (req, res) {
  pool.query(
    "insert into fooditem(itemname, price, typeid) values (?,?,?)",
    [req.body.item, req.body.price, req.body.type],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("foodadd", { message: "Server Error" });
      } else {
        res.render("foodadd", {
          message: "Food Add Successfully!!",
        });
      }
    }
  );
});

///////////////// ----------> Fetch Food Type by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchfoodtype", function (req, res) {
  pool.query("select * from foodtype", function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).json({ result: [], message: "Server Error" });
    } else {
      res.status(200).json({ result: result, message: "Success" });
    }
  });
});

///////////////// ----------> Fetch Food Items by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchfooditem", function (req, res) {
  pool.query(
    "select * from fooditem where typeid=?",
    [req.query.typeid],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json({ data: result });
      }
    }
  );
});

///////////////// ----------> Fetch Offer Type by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchofftype", function (req, res) {
  pool.query("select * from offertype", function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).json({ result: [], message: "Server Error" });
    } else {
      res.status(200).json({ result: result, message: "Success" });
    }
  });
});

///////////////// ----------> Fetch Food Items by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchoffer", function (req, res) {
  pool.query(
    "select * from offer where offtypeid=?",
    [req.query.offtypeid],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json({ data: result });
      }
    }
  );
});

///////////////////-----------> Food Data Submittt <--------------\\\\\\\\\\\\\\\

router.post("/foodsubmit", upload.single("pic"), function (req, res) {
  pool.query(
    "insert into food_details (foodtype, fooditemname, offertype, offer, price, picture)values(?,?,?,?,?,?)",
    [
      req.body.type,
      req.body.item,
      req.body.offertype,
      req.body.offer,
      req.body.price,
      req.file.originalname,
    ],
    function (error, result) {
      if (error) {
        // console.log(error);
        res.render("foodface", { message: "Server Error" });
      } else {
        res.render("foodface", {
          message: "Record Submitted Successfully!!",
        });
      }
    }
  );
});

/////////////-----------> Food Display <-----------\\\\\\\\\\\\\

router.get("/fooddisplay", function (req, res) {
  pool.query(
    "select fd.*,(select T.typename from foodtype T where T.typeid=fd.foodtype) as type, (select I.itemname from fooditem I where I.itemid=fd.fooditemname) as fooditem, (select OT.offtypename from offertype OT where OT.offtypeid=fd.offertype) as offertype, (select o.offname from offer o where o.offid=fd.offer) as offer from food_details fd",
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("fooddisplay", { data: [], message: "Server Error" });
      } else {
        res.render("fooddisplay", { data: result, message: "Successfull!!" });
      }
    }
  );
});

////////////////// ---------> Search Food By Id <------------\\\\\\\\\\\\\\

router.get("/searchbyid", function (req, res) {
  pool.query(
    "select fd.*,(select T.typename from foodtype T where T.typeid=fd.foodtype) as type, (select I.itemname from fooditem I where I.itemid=fd.fooditemname) as fooditem, (select OT.offtypename from offertype OT where OT.offtypeid=fd.offertype) as offertype, (select o.offname from offer o where o.offid=fd.offer) as offer from food_details fd where foodid=?",
    [req.query.fid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("foodmodify", { data: [], message: "Server Error" });
      } else {
        res.render("foodmodify", { data: result[0], message: "Successfull!!" });
      }
    }
  );
});

///////////////////-----------> Food Modification (Edit / Delete) <--------------\\\\\\\\\\\\\\\

router.post("/food_edit_del", function (req, res) {
  if (req.body.button == "Edit") {
    pool.query(
      "update food_details set foodtype=?, fooditemname=?, offertype=?, offer=?, price=? where foodid=?",
      [
        req.body.type,
        req.body.item,
        req.body.offertype,
        req.body.offer,
        req.body.price,
        req.body.foodid,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/food/fooddisplay");
        } else {
          res.redirect("/food/fooddisplay");
        }
      }
    );
  } else {
    pool.query(
      "delete from food_details where foodid=?",
      [req.body.foodid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/food/fooddisplay");
        } else {
          res.redirect("/food/fooddisplay");
        }
      }
    );
  }
});

module.exports = router;
