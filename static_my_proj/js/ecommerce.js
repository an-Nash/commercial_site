$(document).ready(function(){
        //contact ajax
        var contactForm = $(".contact-form")
        var contactFormMethod = contactForm.attr("method")
        var contactFormEndpoint = contactForm.attr("action")
        var contactFormSubmitBtn = contactForm.find("[type='submit']")
        var contactFormSubmitBtnTxt = contactFormSubmitBtn.text()

        function displaySubmitting(doSubmit){
          if (doSubmit){
            contactFormSubmitBtn.addClass("disabled")
            contactFormSubmitBtn.html("<i class='fa faspin fa-spinner'></i> Sending..")
          }
          else{
            contactFormSubmitBtn.removeClass("disabled")
            contactFormSubmitBtn.html(contactFormSubmitBtnTxt)
          }
        }



        contactForm.submit(function(event){
          event.preventDefault()
          var contactFormData = contactForm.serialize()
          var thisForm = $(this)
          displaySubmitting(true)
          $.ajax({
            url :contactFormEndpoint,
            method :contactFormMethod,
            data :contactFormData,
            success : function(data){
              console.log("succes")
              contactForm[0].reset()
              alert("Thanks for your submission")
              setTimeout(function(){
                displaySubmitting(false)
              }, 500)
            },
            error : function(error){
              console.log(error.responseJSON)
              var jsonData = error.responseJSON
              var msg = ""

              $.each(jsonData, function(key, value){
                msg += key + ":" + value[0].message + "<br/>"
              })

              alert(msg)
            }
          })
        })







        //auto search
        var serachForm = $(".search-form")
        var searchInput = serachForm.find("[name='q']")
        var typingTimer;
        var typingInterval = 100
        var searchBtn = serachForm.find("[type='submit']")

        searchInput.keyup(function(event){
          clearTimeout(typingTimer)

          typingTimer = setTimeout(performSearch, typingInterval)
        })

        searchInput.keydown(function(event){
          clearTimeout(typingTimer)
        })

        function doSearch(){
          searchBtn.addClass("disabled")
          searchBtn.html("<i class='fa faspin fa-spinner'></i> Searching...")

        }
        function performSearch(){
          doSearch()
          var query = searchInput.val()
          setTimeout(function(){
            window.location.href = '/search/?q=' + query
          }, 1000)
        }




        //add cart
        var productForm = $(".form-product-ajax")


        productForm.submit(function(event){
          event.preventDefault();
          var thisForm = $(this)
          //var action = thisForm.attr("action");
          var actionEndppoint = thisForm.attr("data-endpoint")
          var httpMethod = thisForm.attr("method");
          var formData = thisForm.serialize();

          $.ajax({
            url: actionEndppoint,
            method: httpMethod,
            data: formData,
            success: function(data){
              console.log("success")
              var submitSpan = thisForm.find(".submit-span")
              if (data.added){
                submitSpan.html("<button type='submit' class='btn btn-success'>Remove</button>")
              }
              else{
                submitSpan.html("<button type='submit' class='btn btn-success'> Add to cart</button>")
              }
              var cartCount = $(".navbar_cart_count")
              cartCount.text(data.countCartItem);
              var currentPath = window.location.href

              if (currentPath.indexOf("cart") != -1){
                refreshCart()
              }
            },
            error: function(errorData){
              console.log(errorData)
            }
          })
        })

        function refreshCart(){
          var cartTable = $(".cart-table")
          var cartBody = cartTable.find(".cart-body")
          //cartBody.html("<h1>Changed</h1>")
          var productRows = cartBody.find(".cart-products")
          var currentUrl = window.location.href

          var refreshCartUrl = '/api/cart/';
          var refreshCartMethod = "GET";
          var data = {};
          $.ajax({
            url : refreshCartUrl,
            method : refreshCartMethod,
            data : data,
            success: function(data){
              var hiddenCartItemRemoveForm = $(".cart-item-remove-form")
              if (data.products.length > 0){
                productRows.html(" ")
                i = data.products.length
                $.each(data.products, function(index, value){
                  console.log(value)
                  var newCartItemRemove = hiddenCartItemRemoveForm.clone()
                  newCartItemRemove.css("display", "block")
                  newCartItemRemove.find(".cart-item-product-id").val(value.id)
                  cartBody.prepend("<tr><th scope=\"row\">" + i + "</th><td><a href='" + value.url + "'>" + value.name + "</a>" + newCartItemRemove.html() + "</td><td>"
                    + value.price + "</td></tr>")
                  i--
                })
                cartBody.find(".cart-subtotal").text(data.subtotal)
                cartBody.find(".cart-total").text(data.total)

              }
              else {
                window.location.href = currentUrl
              }
            },
            error: function(errorData){
              console.log("error")
              console.log(errorData)
            }
          })
        }


      })