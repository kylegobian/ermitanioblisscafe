const products = [
 {id:1,name:"Sunday Morning Blend",type:"beans",tag:"BESTSELLER",desc:"Chocolate, caramel & a soft citrus finish · 250g",price:480,img:"https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=700&q=80"},
 {id:2,name:"The Slowdown",type:"ground",tag:"SMOOTH & BALANCED",desc:"Toasted nuts, milk chocolate · 250g",price:420,img:"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=80"},
 {id:3,name:"Midnight Roast",type:"beans",tag:"DARK ROAST",desc:"Rich cocoa, brown sugar & a bold finish · 250g",price:520,img:"https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=700&q=80"},
 {id:4,name:"Cold Brew Classic",type:"ready",tag:"READY TO SIP",desc:"Slow-steeped for 18 hours · 250ml",price:160,img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"},
 {id:5,name:"Little Ritual Drip Bags",type:"ground",tag:"EASY BREW",desc:"Five single-serve pour-over sachets",price:350,img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80"},
 {id:6,name:"The Coffee Lover Box",type:"gifts",tag:"GIFT FAVORITE",desc:"Two coffee bags + a ceramic mug",price:1250,img:"https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=700&q=80"},
 {id:7,name:"Golden Hour Decaf",type:"beans",tag:"CAFFEINE-FREE",desc:"Honey, almond & mellow cocoa · 250g",price:490,img:"https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=700&q=80"},
 {id:8,name:"Blissful Brew Set",type:"gifts",tag:"A THOUGHTFUL GIFT",desc:"Drip coffee, tasting cup & brew guide",price:890,img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80"}
];
const peso = n => new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);
let activeFilter="all", cart=JSON.parse(localStorage.getItem("bb-cart")||"{}"), toastTimer;
const grid=document.getElementById("productGrid");
function renderProducts(){
 let list=products.filter(p=>activeFilter==="all"||p.type===activeFilter);
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low") list.sort((a,b)=>a.price-b.price);
 if(sort==="high") list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="quick-add" data-add="${p.id}">＋ Add to bag</button></div><div class="product-meta"><h3>${p.name}</h3><b>${peso(p.price)}</b></div><p class="product-desc">${p.desc}</p></article>`).join("");
}
function saveCart(){localStorage.setItem("bb-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();showToast("Added to your bag — lovely choice!")}
function renderCart(){
 const entries=Object.entries(cart).filter(([,q])=>q>0);
 const count=entries.reduce((s,[,q])=>s+q,0), total=entries.reduce((s,[id,q])=>s+products.find(p=>p.id===+id).price*q,0);
 document.getElementById("cartCount").textContent=count;
 document.getElementById("drawerCount").textContent=`(${count})`;
 document.getElementById("cartSubtotal").textContent=peso(total);
 document.getElementById("cartItems").innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>x.id===+id);return `<div class="cart-item"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><small>${peso(p.price)}</small><div class="quantity"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${q}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${id}">Remove</button></div>`}).join(""):`<div class="empty-cart">Your bag is looking a little empty.<br><span>Let's find you something good. ☕</span></div>`;
}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2400)}
function setCartOpen(open){document.getElementById("cartDrawer").classList.toggle("open",open);document.getElementById("overlay").classList.toggle("show",open);document.getElementById("cartDrawer").setAttribute("aria-hidden",String(!open));document.body.style.overflow=open?"hidden":""}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(+b.dataset.add)});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()}));
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("cartOpen").addEventListener("click",()=>setCartOpen(true));
document.getElementById("cartClose").addEventListener("click",()=>setCartOpen(false));
document.getElementById("overlay").addEventListener("click",()=>setCartOpen(false));
document.getElementById("cartItems").addEventListener("click",e=>{
 const qty=e.target.closest("[data-qty]"), remove=e.target.closest("[data-remove]");
 if(qty){const id=qty.dataset.qty;cart[id]=(cart[id]||0)+Number(qty.dataset.delta);if(cart[id]<=0)delete cart[id];saveCart()}
 if(remove){delete cart[remove.dataset.remove];saveCart()}
});
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
document.getElementById("contactForm").addEventListener("submit",e=>{
 e.preventDefault();const data=new FormData(e.currentTarget);
 const subject=encodeURIComponent(data.get("subject"));
 const body=encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
 document.getElementById("contactStatus").textContent="Opening your email app with your message…";
 window.location.href=`mailto:brewandblisscafe@gmail.com?subject=${subject}&body=${body}`;
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterStatus").textContent="Thanks for joining our coffee circle! Connect an email platform to collect subscribers.";e.currentTarget.reset()});
const menuToggle=document.getElementById("menuToggle"), nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"×":"☰"});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.textContent="☰"}));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();


// ------------------------------------------------------------
// Account, profile, and demonstration checkout
// All account/order data is stored locally in this browser only.
// This is not secure authentication and does not process payments.
const ACCOUNT_KEY = "bb-demo-account";
const ORDERS_KEY = "bb-demo-orders";
let currentAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");

const accountPanel = document.getElementById("accountPanel");
const checkoutPanel = document.getElementById("checkoutPanel");
const overlay = document.getElementById("overlay");

function showPanel(panel) {
  setCartOpen(false);
  accountPanel.classList.remove("panel-visible");
  checkoutPanel.classList.remove("panel-visible");
  accountPanel.setAttribute("aria-hidden", "true");
  checkoutPanel.setAttribute("aria-hidden", "true");
  panel.classList.add("panel-visible");
  panel.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
  window.scrollTo({top: 0, behavior: "smooth"});
}
function hidePanels() {
  accountPanel.classList.remove("panel-visible");
  checkoutPanel.classList.remove("panel-visible");
  accountPanel.setAttribute("aria-hidden", "true");
  checkoutPanel.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}
function setAuthTab(tab) {
  document.querySelectorAll("[data-auth-tab]").forEach(b => b.classList.toggle("active", b.dataset.authTab === tab));
  document.getElementById("signInForm").classList.toggle("hidden", tab !== "signin");
  document.getElementById("signUpForm").classList.toggle("hidden", tab !== "signup");
}
function openAccount() {
  showPanel(accountPanel);
  renderAccount();
}
function renderAccount() {
  const authView = document.getElementById("authView");
  const profileView = document.getElementById("profileView");
  authView.classList.toggle("hidden", !!currentAccount);
  profileView.classList.toggle("hidden", !currentAccount);
  if (!currentAccount) {
    setAuthTab("signin");
    return;
  }
  document.getElementById("profileName").textContent = currentAccount.name || "Coffee friend";
  document.getElementById("profileEmail").textContent = currentAccount.email || "";
  document.getElementById("profileInitials").textContent = (currentAccount.name || "B").split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase();
  const form = document.getElementById("profileForm");
  ["name","email","phone","address"].forEach(key => form.elements[key].value = currentAccount[key] || "");
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const mine = orders.filter(o => o.email === currentAccount.email);
  document.getElementById("orderHistoryText").textContent = mine.length
    ? `${mine.length} demo order${mine.length === 1 ? "" : "s"} placed. Most recent: ${mine[0].date}.`
    : "Your confirmed demo orders will appear here.";
}
document.getElementById("profileOpen").addEventListener("click", openAccount);
document.getElementById("footerAccount").addEventListener("click", e => { e.preventDefault(); openAccount(); });
document.getElementById("accountClose").addEventListener("click", hidePanels);
document.getElementById("accountBack").addEventListener("click", e => { e.preventDefault(); hidePanels(); });
document.querySelectorAll("[data-auth-tab]").forEach(b => b.addEventListener("click", () => setAuthTab(b.dataset.authTab)));

document.getElementById("signUpForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  currentAccount = {
    name: String(data.get("name")).trim(),
    phone: String(data.get("phone")).trim(),
    email: String(data.get("email")).trim().toLowerCase(),
    password: String(data.get("password")),
    address: String(data.get("address")).trim()
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(currentAccount));
  e.currentTarget.reset();
  renderAccount();
  showToast("Your demo profile has been created.");
});
document.getElementById("signInForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const saved = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
  const email = String(data.get("email")).trim().toLowerCase();
  if (!saved || saved.email !== email || saved.password !== String(data.get("password"))) {
    showToast("No matching demo account. Create an account first.");
    return;
  }
  currentAccount = saved;
  renderAccount();
  showToast("Welcome back!");
});
document.getElementById("profileForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  currentAccount = {...currentAccount,
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim().toLowerCase(),
    phone: String(data.get("phone")).trim(),
    address: String(data.get("address")).trim()
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(currentAccount));
  renderAccount();
  showToast("Your profile has been updated.");
});
document.getElementById("signOutBtn").addEventListener("click", () => {
  currentAccount = null;
  renderAccount();
  showToast("You have signed out.");
});

function cartEntries() {
  return Object.entries(cart).filter(([,q]) => q > 0).map(([id,q]) => ({product: products.find(p => p.id === +id), quantity:q})).filter(x => x.product);
}
function cartTotal() {
  return cartEntries().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}
function renderCheckoutSummary() {
  const entries = cartEntries();
  document.getElementById("checkoutItems").innerHTML = entries.map(({product,quantity}) =>
    `<div class="checkout-item"><img src="${product.img}" alt=""><div><b>${product.name}</b><small>Qty ${quantity}</small></div><strong>${peso(product.price * quantity)}</strong></div>`
  ).join("");
  document.getElementById("checkoutSubtotal").textContent = peso(cartTotal());
  document.getElementById("checkoutTotal").textContent = peso(cartTotal());
}
function openCheckout() {
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  if (!count) { showToast("Your bag is empty for now."); return; }
  if (!currentAccount) {
    openAccount();
    showToast("Please sign in or create an account before checkout.");
    return;
  }
  showPanel(checkoutPanel);
  document.getElementById("checkoutForm").classList.remove("hidden");
  document.getElementById("orderSuccess").classList.add("hidden");
  document.getElementById("checkoutName").value = currentAccount.name || "";
  document.getElementById("checkoutPhone").value = currentAccount.phone || "";
  document.getElementById("checkoutEmail").value = currentAccount.email || "";
  document.getElementById("checkoutAddress").value = currentAccount.address || "";
  renderCheckoutSummary();
}
document.getElementById("checkoutBack").addEventListener("click", () => { hidePanels(); setCartOpen(true); });
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!document.getElementById("detailsConfirm").checked) return;
  const data = new FormData(e.currentTarget);
  const order = {
    id: "BB-" + Date.now().toString().slice(-8),
    date: new Date().toLocaleString("en-PH"),
    name: String(data.get("name")).trim(),
    phone: String(data.get("phone")).trim(),
    email: String(data.get("email")).trim().toLowerCase(),
    address: String(data.get("address")).trim(),
    payment: String(data.get("payment")),
    items: cartEntries().map(({product,quantity}) => ({name:product.name, quantity, price:product.price})),
    total: cartTotal()
  };
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  currentAccount = {...currentAccount, name:order.name, phone:order.phone, email:order.email, address:order.address};
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(currentAccount));
  cart = {};
  saveCart();
  document.getElementById("checkoutForm").classList.add("hidden");
  document.getElementById("orderSuccess").classList.remove("hidden");
  document.getElementById("successMessage").textContent =
    `Order ${order.id} has been saved in this browser. Payment method: ${order.payment}. No payment was processed.`;
});
document.getElementById("continueShopping").addEventListener("click", () => {
  hidePanels();
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
});
overlay.addEventListener("click", () => {
  if (accountPanel.classList.contains("panel-visible") || checkoutPanel.classList.contains("panel-visible")) hidePanels();
});
