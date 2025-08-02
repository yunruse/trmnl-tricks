# TRMNL Tips and Tricks

![Commit count](https://img.shields.io/github/commit-activity/t/yunruse/trmnl-tricks?label=version)
![Last commit date](https://img.shields.io/github/last-commit/yunruse/trmnl-tricks?label=correct%20as%20of%20)

Hihi! I'm Mia, creator of such plugins as
[Daily Tarot](https://usetrmnl.com/recipes/35833/install),
[Daily Rituals](https://usetrmnl.com/recipes/47433/install),
[Toki Pona Word of the Day](https://usetrmnl.com/recipes/36529/install),
[Cats, Dogs and Cat Facts](https://usetrmnl.com/recipes/36529/install),
[MEE6 Discord Leaderboard Status](https://usetrmnl.com/recipes/48539/install),
[The Yetee Shirts of the Day](https://usetrmnl.com/recipes/83869/install) and
[Persona 5 Calendar](https://cdn.discordapp.com/attachments/1364903605441925180/1364912460275912815/private_plugin_36140.zip?ex=6810ab49&is=680f59c9&hm=7d390e7e780453df285841416d513d32a4e1da1b9318c6edc222d42cc20437cd&), a winner in the [data mode hackathon](https://usetrmnl.com/blog/introducing-data-mode).

Here are a whole bunch of tips for [TRMNL](https://usetrmnl.com) plugin creation. Hope they help!

Any and all feedback, suggestions or errors - please [open an issue](https://github.com/yunruse/trmnl-tricks/issues/new)!

## Table of contents

- [Plugin metadata](#plugin-metadata)
  - [FYI: Developer Edition is per device!](#fyi-developer-edition-is-per-device)
  - [Installing vs Forking](#installing-vs-forking)
  - [Using form variables in plugin settings](#using-form-variables-in-plugin-settings), as defined in [custom forms](https://help.usetrmnl.com/en/articles/10513740-custom-plugin-form-builder)
  - [Adding custom HTML to forms](#adding-custom-html-to-forms) (_thanks to datacompboy_)
  - [Forking an official plugin](#forking-an-official-plugin)
  - [Sending data to a webhook](#sending-data-to-a-webhook)
  - [Webhook data limits (and tricks to squeeze more data out)](#webhook-data-limits-and-tricks-to-squeeze-more-data-out)
- [Liquid rendering](#liquid-rendering)
  - [Getting the right timezone](#getting-the-right-timezone)
  - [Sending variables to JavaScript](#sending-variables-to-javascript)
  - [A whistlestop tour of Liquid filters and operators](#a-whistlestop-tour-of-liquid-filters-and-operators)
  - [Widget height and width](#widget-height-and-width)
- [TRMNL Framework](#trmnl-framework)
  - [Rotated `.item` indexes](#rotated-item-indexes)
  - [Clamp on the word, not the letter](#clamp-on-the-word-not-the-letter)
  - [QR codes](#qr-codes)

## Plugin metadata

### FYI: Developer Edition is per device!

If you buy multiple TRMNLs, Developer Edition - which allows you to do pretty much everything here - is per device. There are [official workarounds](https://help.usetrmnl.com/en/articles/11629486-calculating-byod-and-dev-edition-add-ons), however.

### FYI: Installation works with forms (and is better than forking)

Developer Edition is required to **fork** a plugin. [As of July 10](https://www.reddit.com/r/trmnl/comments/1lwma99/community_plugins_recipes_are_now_installable_by/), forking is only useful if you want to modify the behaviour of the plugin. If you want to use custom forms – Developer Edition or no – then **installation** is the better option, as it allows the recipe to auto-update (for new features, to respond to API changes, to fix glitches, etc).

### Using form variables in plugin settings
Rather than put your key into a polling URL or header, you can use `{{variables}}`
defined in [custom forms](https://help.usetrmnl.com/en/articles/10513740-custom-plugin-form-builder) _directly_ in forms. You can also use `trmnl`:

<img width="538" height="174" alt="ss 2025-08-02 at 15 39 49" src="https://github.com/user-attachments/assets/6b1107d1-876a-4d6d-87f3-4a4444e048eb" />

### Adding custom HTML to forms
_thanks to datacompboy for this tip!_

You may want to decorate the mandatory `field-type: author_bio`, or `field-type: description`. Alternatively, you might want to add `help_text` to a form, which appears below the form (handy for implementation details or link to a reference document.

To that end, you can use a limited subset of HTML. Specifically, you can use the elements `<br>`, `<strong>`/`<b>` and `<a>` tags in form descriptions, alongside `class`, `href` and `target="_blank"`.
   
For example:

```yml
- keyname: desc1
  field_type: description
  name: Welcome to the Orthanc Door Controls
  description: >
    <b class="text-red-600">Warning: not suitable for non-wizards!</b>
    <br/>
    Please see <a class="underline" href="https://en.wikipedia.org/wiki/Isengard">Isengard Documentation</a> for more.
    <br/>
    If <b class="text-blue-800">Saruman</b> keeps undoing your decisions, go to <a class="bg-emerald-100">Settings -&gt; Saruman -&gt; Draw As If Poison From A Wound</a>.

- keyname: my_bool
  field_type: select
  name: Let Balrog in?
  options:
  - "You shall pass": true
  - "YOU SHALL NOT PASS": false
  help_text: Make sure you are a servant of the <b class="text-red-400">Secret Fire</b>, wielder of the <b class="text-red-400">flame of Anor</b> first.
```

will produce:

<img width="563" height="242" alt="ss 2025-08-02 at 15 44 45" src="https://github.com/user-attachments/assets/fba395ad-8a93-407f-b30e-0c0c746511d7" />

### Forking an official plugin

[Certain official plugins can have their data fetched](https://docs.usetrmnl.com/go/private-api/fetch-plugin-content) by using:

```python
# In Polling URL
https://usetrmnl.com/api/plugin_settings/{{plugin_id}}/data
# In the Polling Headers:
authorization=bearer {{user_auth_token}}
```
where `{{plugin_id}}` is the defined ID of your plugin instance and `{{user_auth_token}}` can be fetched from the [account tab](https://usetrmnl.com/account).

If you want to fork a plugin, here are some templates I've created that do just that:
- [Weather](https://cdn.discordapp.com/attachments/1344003578947440711/1362525097075937400/weather_plugin_fork.zip?ex=6802b5e1&is=68016461&hm=f46dec20d737837cca5b40c97d27c0dc6c8a0bdbac339596375884afbf7dba90&)
<!-- - [Stocks]() -->
<!-- - [Calendar]() -->

### Sending data to a webhook

Webhook data is sent with a POST request using the header `Content-Type: application/json`.

On Python, you can simply `pip install requests` and

```py
import requests
URL = f"https://usetrmnl.com/api/custom_plugins/{your_plugin_uuid}"
data = {
  "my_data": {"a": 1, "b": [1, 2, 3]},
  "foo": "long string",
}
requests.post(URL, json={'merge_variables': data})
```

You will either receive the codes:

- _429 Too Many Requests_ – You will receive this if you send data more frequently than every five minutes. **Be mindful of the servers!**
- _200 OK_ – The response is a JSON object. Check its `message` key: if it is `null` you're fine. If not, it will explain what went wrong.

### Webhook data limits (and tricks to squeeze more data out)

Note that you can only send **2 kibibytes**, i.e. `len(json.dumps(data)) < 2050` in the example above.

For maximum clarity, this is the length of the JSON <em>inside</em> of <code>merge_variables</code>; the outside JSON may contain other instructions or metadata (see below).

#### Using `deep_merge` to extend objects

If you set `"merge_strategy": "deep_merge"`, then dictionary objects will be merged-in by key, rather than replacing the entire variable state. This is arbitrarily deep, but only works on objects. For example:

```py
# state: {"a": {"b": {"first": 1}}}
requests.post(URL, json={'merge_variables': {"a": {"b": {"second": 2}}}, "merge_strategy": "deep_merge"})
# state: {"a": {"b": {"first": 1, "second": 2}}}
requests.post(URL, json={'merge_variables': {"xyz": "true"}, "merge_strategy": "deep_merge"})
# state: {"a": {"b": {"first": 1, "second": 2}}, "xyz": "true"}
```

#### Using `streaming` to extend arrays

If you set `"merge_strategy": "stream"`, top-level arrays will instead be appended to. You may also set a `"stream_limit"` to truncate. For example:

```py
# state: {"a": [1, 2]}
requests.post(URL, json={'merge_variables': {"a": [3, 4, 5, 6, 7]}, "merge_strategy": "stream"})
# state: {"a": [1, 2, 3, 4, 5, 6, 7]}
requests.post(URL,json={'merge_variables': {"a": [8, 9]}, "merge_strategy": "stream", "stream_limit": 4})
# state: {"a": [6, 7, 8, 9]}
```

#### Squeezing out even more data

If you're somehow still pressed for space, the following tips may help:
- Reduce whitespace if you can. You don't need spaces or newlines.

  For example, `{"foo":"long string","my_data":{"a":1,"b":2}}`.
- Rename and unpack variables.

  For example `{"c":"long string","a":1,"b":2}`
- Use zlib to compress. If your data is English text or JSON data, it may be reasonably compressible.

In python, you can, for example:

```py
def compress(string: str):
    import zlib, base64
    return base64.b64encode(
        zlib.compress(string.encode())).decode()
```

However, you won't be able to decompress in Liquid; you'll have to render the data in JavaScript:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
<script>
  const decompress = blob => window.pako.inflate(
      Uint8Array.from(atob(blob), c => c.charCodeAt(0)),
      { to: 'string' });
  document.querySelector('#myElement').innerText = decompress({{myText | json}})
</script>
```

## Liquid rendering

Check out the documentation!
- [Liquid documentation](https://shopify.dev/docs/api/liquid)
- [Shopify's Liquid filters](https://shopify.dev/docs/api/liquid/filters)
- [TRMNL's Liquid filters](https://help.usetrmnl.com/en/articles/10347358-custom-plugin-filters)

### Getting the right timezone

_Time is an illusion. Lunchtime, doubly so._

TRMNL does respect your time zone (as set in [_About_](https://usetrmnl.com/account)), plus any daylight savings, as stored in the `trmnl` variables. However, eking those out into _your_ current time may be a tiny effort:

#### In Liquid

Don't forget that TRMNL provides Liquid with the _UTC_ time and your offset _from_ UTC. If you'd like to set a custom time, try:

```liquid
{% assign time = trmnl.system.timestamp_utc | plus: trmnl.user.utc_offset | date: "%F %T%z" %}
```

The `date` filter turns a number into a formatted date; you might want to just set it to the number and format it in multiple ways separately. `date`'s format, such as `%F %T%z`, uses symbols [common to all strftime methods](https://strftime.org).

#### In JavaScript

JavaScript, likewise, assumes your time zone is in UTC. It's not the prettiest method, but to guarantee your date is right, try:

```js
const NOW = new Date(new Date().valueOf() + {{trmnl.user.utc_offset}} * 1000);
```

Note that while `trmnl.user` contains correct information, JavaScript will continue to misremember your time zone. Be careful and make sure to test well just in case!

### Sending variables to JavaScript

If you want to pass an object directly into JavaScript, no need to iterate or parse yourself – try for example:

```js
let some_list = JSON.parse(`{{data.my_list | json}}`)
```

### A whistlestop tour of Liquid filters and operators

#### Filters

Filters are great for transforming things -- uppercase, split or otherwise. While certain data structures might require using JS (or very arcane Liquid) there are many cases where you can have filters handle it for you.

For example, you might use:

```liquid
{% assign foo = data.first_name | default: "No name found" | prepend: "Hi, " | append "!" %}
<h1>Hi, {{data.first_name}}</h1>
```

#### Operators in Liquid context

As you've just seen, you don't need just `{{expression}}` - you can use `{%operators%}`, too. For example:



```liquid
{% for i in (1..10) %}
  {% assign i2 = i | modulo: 2 %}
  {% if i < 3 %}
    {% continue %}
  {% elsif i == 5 %}
    (high five!) 
  {% elsif i2 == 1 %}
    {{i | at_most: 7}} and
  {% else %}
    {% cycle 'boots and ', 'cats and ' %}
  {% endif %}
{% endfor %}
```

would show up as `3 and boots and (high five!) cats and 7 and boots and 7 and cats and`.

If that's unwieldy you can also use a `liquid` block:

```
{% assign numbers = (1..10) %}
{% liquid
   for i in numbers
     assign i2 = i | modulo: 2
     if i < 3
       continue
     elsif i == 5
       echo "(high five!) "
     elsif i2 == 1
       echo i | at_most: 7
       echo " and "
     else
       cycle 'boots and ', 'cats and '
     endif
   endfor
%}
```

### Widget height and width

If your plugin needs to know the height/width, use this:

```html
<!-- Full -->
{% assign width=780 %}
{% assign height=460 %}
<!-- Half-horizontal -->
{% assign width=780 %}
{% assign height=225 %}
<!-- Half-vertical -->
{% assign width=400 %}
{% assign height=460 %}
<!-- Quadrant -->
{% assign width=400 %}
{% assign height=235 %}
```

## TRMNL Framework

The [Framework design system](https://usetrmnl.com/framework) is wonderful. Here are a bunch of snippets and extensions that might help with certain things.

### Rotated `.item` indexes

![image width=40](https://gist.github.com/user-attachments/assets/4e8eb4cc-2099-4279-ab09-ea8c9308c7a2)

No need for `translate: transform` headaches! If you want rotated labels on an [`.item`](https://usetrmnl.com/framework/item), just use:

```css
.index {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

### Clamp on the word, not the letter

By default, `clamp--2` (etc) will clamp on the letter, not the word. If you're okay with a little less space, consider adding `clamp--nicely` and adding to a stylesheet:

```css
.clamp--nicely {
  word-break: normal !important;
}
```

### QR Codes

![qr](https://github.com/user-attachments/assets/83f4143b-2b9c-4b48-8a36-83118b581aca)


To display a QR code, insert a `<qr></qr>` element, and then add a handful of code at the _bottom_ of your page:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" integrity="sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA==" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>
<script src="https://cdn.jsdelivr.net/gh/yunruse/trmnl-tricks/QR.js" defer></script>
<style>
  qr img {
    border: 10px solid white;
    display: inline;
  }
  qr img {
    display: inline !important;
  }
</style>
```

#### QR Contents

> [!TIP]
> **If your QR code is in all-caps it takes up less space.** If you're super low on space, try a URL shortener in all-caps.

For basic text, such as a URL, simply put it in the element text. For other formats, you may use these attributes instead:

- For email, provide a `qr-email-address`.
- For telephone, provide a `qr-telephone`.

- For SMS, provide a `qr-sms-number`; optionally you may add a `qr-sms-message`.
- For Wi-Fi logins, provide a `qr-wifi-ssid` and `qr-wifi-password`.
  
  You may also, optionally, specify `qr-wifi-encryption` (by default, WPA is used) or a bare `qr-wifi-hidden` for a hidden network.

- For Apple Shortcuts, provide its name in `qr-apple-shortcut`

For example:

```html
<qr>HTTPS://TINYURL.COM/TRMNL-QR-EXAMPLE</qr>
<qr qr-apple-shortcut="Toggle Orthanc Doors"></qr>
<qr qr-telephone="+1310-807-3956"></qr>
<qr qr-sms-number="+1310-807-3956"
  qr-sms-message="can you open up the door"
  ></qr>
<qr qr-wifi-ssid="Moria"
  qr-wifi-password="mellon"
  ></qr>
<qr qr-email-address="gwaihir@eagles.manwe.vlr"></qr>
```
