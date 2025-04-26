# TRMNL Tips and Tricks

Hihi! I'm Mia, creator of such TRMNL plugins as [Daily Tarot](https://usetrmnl.com/recipes/35833/install), [Toki Pona Word of the Day](https://usetrmnl.com/recipes/36529/install) and so on.

I'm here with a bunch of tips for [TRMNL](https://usetrmnl.com) plugin creation. Hopefully they help out a bit!

## Table of contents

- [Metadata and general tips](#metadata-and-general-tips)
  - [FYI: Developer Edition is per device!](#fyi-developer-edition-is-per-device)
  - [Using form variables in plugins](#using-form-variables-in-plugins), as defined in [custom forms](https://help.usetrmnl.com/en/articles/10513740-custom-plugin-form-builder)
  - [Adding custom HTML to forms](#adding-custom-html-to-forms) (_thanks to datacompboy_)
  - [Forking an official plugin](#forking-an-official-plugin)
- [Liquid rendering](#liquid-rendering)
  - [Widget height and width](#widget-height-and-width)
- [TRMNL Framework](#trmnl-framework)
  - [Rotated .item indexes](#rotated-item-indexes)
  - [QR codes](#qr-codes)

## Metadata and general tips

### FYI: Developer Edition is per device!

_This is accurate as of April 2025._

If you buy multiple TRMNLs, Developer Edition - which allows you to do pretty much everything here - is per device.

Note that if you don't have Developer Edition, you can **install but not fork** a recipe. Keep this in mind if you want your recipe to be more accessible to others.

### Using form variables in plugins
Rather than put your key into a polling URL or header, you can use `{{variables}}`
defined in [custom forms](https://help.usetrmnl.com/en/articles/10513740-custom-plugin-form-builder).
Note that you should **not** use the `trmnl.plugin_settings.custom_fields_values` - just the key name.

![image](https://gist.github.com/user-attachments/assets/d69defcf-a1bf-4108-9880-7ff4a3d138b7)


### Adding custom HTML to forms
_thanks to datacompboy for this tip!_

You can use `<br>`, `<strong>`/`<b>` and `<a>` tags in form descriptions, alongside `class`, `href` and `target="_blank"`. For example:

```yml
- keyname: __
  field_type: description
  name: Usage instructions
  description: >
    You need to have <a href="https://nightscout.github.io/" class="underline">Nightscout-compatible</a> server.<br/>
    If you don't know what it is -- just install <a href="https://gluroo.com/" class="underline">Gluroo</a> app on your phone,<br/>
    and go to <strong class="bg-blue-100">Menu -&gt; Devices -&gt; OTHER tab</strong> to find your Nightscout URL and API secret.
    
- keyname: ___
  field_type: description
  name: WARNING DO NOT USE THIS PLUGIN FOR MEDICATION DECISIONS
  description: >
    <b>Follow medical advise from medical specialists.</b><br/>
    While you can see graph from the device here, it may be
    <b class="text-blue-400">outdated</b>, sometimes by an hour or more;
    the plugin graph is mere convenience, but <b>NOT</b> for decisions.<br />
    <b class="text-red-400">If you feel bad, contact 112 or 911 or whatever your emergency number is!</b>
```

will produce:

![image](https://gist.github.com/user-attachments/assets/49098a37-4bdc-438f-9b20-a6fd7fae61cf)

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

## Liquid rendering

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

### Rotated .item indexes

![image width=40](https://gist.github.com/user-attachments/assets/4e8eb4cc-2099-4279-ab09-ea8c9308c7a2)

No need for `translate: transform` headaches! If you want rotated labels on an [`.item`](https://usetrmnl.com/framework/item), just use:

```css
.index {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

### QR Codes

To display a QR code, insert a `<qr></qr>` element, and then add a handful of code at the bottom of your page (see the bottom of this section).

By default, minimum error correction (`qr-correction="L"`) is used, as unlike paper, digital displays tend not to tear.

For basic text, such as a URL, simply put it in the element text. For other formats, you may use these attributes instead:

- For email, provide a `qr-email-address`.
- For telephone, provide a `qr-telephone`.

- For SMS, provide a `qr-sms-number`; optionally you may add a `qr-sms-message`.
- For Wi-Fi logins, provide a `qr-wifi-ssid` and `qr-wifi-password`.
  
  You may also, optionally, specify `qr-wifi-encryption` (by default, WPA is used) or a bare `qr-wifi-hidden` for a hidden network.

- For Apple Shortcuts, provide its name in `qr-apple-shortcut`

> [!TIP]
> **If your QR code is in all-caps it takes up less space.** If you want to squeeze a few pixels of space, try testing a URL or email in all-caps first to see if it works. 

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

Then, at the bottom of the page (the order is important!), place:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" integrity="sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://raw.githubusercontent.com/yunruse/trmnl-tricks/refs/heads/main/QR.js"></script>
<style>
  [data-qr-mode] {
    border: 10px solid white;
  }
</style>
```



# Credits