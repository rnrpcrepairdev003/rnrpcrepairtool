export const KNOWLEDGE_BASE = `
RNRPC REPAIR — INTERNAL CSR KNOWLEDGE BASE
===========================================
Use ONLY this knowledge base to answer questions. Do not make up pricing, turnaround times, or scripts.

--- LAPTOPS & DESKTOPS ---

#1 — Won't charge / won't turn on
Symptoms: Laptop won't charge even when plugged in. Laptop won't turn on.
Follow-up questions: What happened to it? Have you tried a different outlet? When did this start? Does it charge a little or stay at 0%? When was the last time it was on?
Script: "This could be a few things — the charger, the port, or something internal. We'd need to take a look to narrow it down. Our diagnostic is $150 and it goes toward the repair."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 3–7 business days
Internal notes: Could be charger, port, battery, charging IC, or motherboard.

#2 — Cracked / broken screen (laptop still turns on)
Symptoms: Laptop screen is cracked or broken but laptop still works.
Follow-up questions: How did that happen? What do you see on the screen when on? When did the screen break? Do you know the laptop model number?
Script: "Screen replacements are pretty common. If you can get us the model number we can check parts availability. Best to bring it in so we can confirm and get you a quote."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: Varies by model (quote after inspection)
Turnaround: 2–5 business days
Internal notes: Model-dependent. Get model number on the call if possible.

#3 — Pop-ups everywhere / runs really slow (malware)
Symptoms: Computer has pop-ups everywhere and runs really slow.
Follow-up questions: How did this happen? How long ago? Did you recently install anything or click a link? Did anyone call you saying they were from tech support?
Script: "Sounds like it could be infected. We do a full cleanup and scan. We might be able to start remotely — do you have internet access on the computer right now?"
Ask about data backup: Yes
Service type: Flat Rate | Remote first, escalate to In-Office if unbootable
Pricing: $125–$200
Turnaround: 1–3 business days
Internal notes: If they can connect remotely, may be able to do partial remote.

#4 — Desktop beeps on startup, nothing on screen
Symptoms: Desktop beeps when turned on but nothing shows on screen.
Follow-up questions: How did this happen? How long ago? Drop it, move it, power outage? Were there any power surges recently? Has anything changed — new parts, updates?
Script: "Those beeps usually mean something inside needs attention — could be memory, the graphics, or the power. We'd need to run diagnostics in the shop. Our diagnostic is $150 and it goes toward the repair."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Beep codes: RAM not seated, GPU/CPU issue, PSU failure.

#5 — Stuck on spinning Windows logo / won't load
Symptoms: Computer stuck on spinning Windows logo and won't load.
Follow-up questions: How did this happen? Did this start after a power outage or update? Do you see any error codes or blue screens? Has this happened before? How old is the computer?
Script: "Sounds like a boot issue. We'll check the drive, back up your data, and reinstall the system if needed. Let's get you scheduled to bring it in."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: Corrupted boot sector, failing HDD, software update failure.

#6 — Laptop keyboard stopped working
Symptoms: Keyboard on laptop stopped working.
Follow-up questions: How did this happen? Did you spill anything on it? Do any keys work at all or is the whole keyboard dead?
Script: "We'll test the keyboard and the internal connection. If it needs replacing, we'll get you a quote after diagnosis."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Keyboard fail, ribbon cable, water damage.

#7 — Laptop fan loud / overheating
Symptoms: Laptop fan is super loud and gets really hot.
Follow-up questions: How long ago did this start? Has it ever shut down on its own from heat? Is the fan constant or only sometimes? How old is the laptop? Do you use it on soft surfaces like a bed or couch?
Script: "We'll clean the internals and refresh the cooling system. Very common issue, usually a straightforward fix."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $125–$175
Turnaround: 2–3 business days
Internal notes: Dust, thermal paste, failing fan.

#8 — Desktop mouse and keyboard stopped working
Symptoms: Mouse and keyboard stopped working on desktop.
Follow-up questions: Do you still get to the login screen? Was there a recent Windows update? Is the computer still powering on normally?
Script: "This could be the operating system, the hard drive, or the motherboard. We'll need to take a closer look to figure out the cause."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: USB controller, driver corruption, motherboard.

#9 — Think computer was hacked
Symptoms: Computer was hacked, something feels off.
Follow-up questions: Are you seeing unexpected pop-ups or emails? Have any passwords been changed? Did anyone call you or ask for remote access? Did you download software?
Script: "We'll do a deep security scan and check for intrusions. We strongly recommend changing all your passwords from a different device right away. Let's get it in for a full check."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: Remote access malware, keylogger, account compromise. Preserve files first.

#10 — Computer shuts off randomly by itself
Symptoms: Computer just turns off by itself randomly.
Follow-up questions: Does it happen when doing something heavy or even when idle? Any warning before it shuts down? Do you smell anything burning? How old is the computer?
Script: "Random shutdowns usually point to overheating or a failing power component. We'd need to diagnose it in the shop to pinpoint the cause."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Overheating, PSU failure, motherboard issue.

#11 — Blue screen (BSOD)
Symptoms: Getting a blue screen every time computer starts.
Follow-up questions: Did this start after an update or installing something? Do you see an error code on the blue screen? Can you get it to start at all — even briefly? Has this happened before?
Script: "Blue screens can be software or hardware. If you can get into Safe Mode, we might try a remote fix first. Otherwise, bring it in and we'll take care of it."
Ask about data backup: Yes
Service type: Diagnostic | Remote first, escalate to In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: BSOD can be remote if boots to safe mode.

#12 — Computer won't power on at all — nothing happens
Symptoms: Computer won't power on at all, nothing happens.
Follow-up questions: Have you tried a different outlet? Was there a storm or power outage recently? Did anything happen before this — a drop, a spill?
Script: "If nothing's coming on at all, it could be the power supply, the battery, or something on the board. We'd need to open it up and test. Bring it in and we'll diagnose it."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 3–5 business days
Internal notes: PSU, battery, motherboard, power jack. Check for physical damage.

#13 — Laptop screen went black but can hear it running
Symptoms: Laptop screen went black but can still hear it running.
Follow-up questions: Did you drop it or close it hard? Any flickering before it went black? What do you see on the screen?
Script: "Could be the screen, the backlight, or the cable connecting them. We'll need to test it in the shop to figure out which one."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: Backlight failure, display cable, inverter, GPU.

#14 — Computer extremely slow
Symptoms: Computer is extremely slow, takes forever to do anything.
Follow-up questions: How long has it been this way? Did it start after installing something or an update? How old is the computer? Does it make any clicking or grinding noises?
Script: "Slow performance can be a lot of things — software bloat, a failing drive, or even a virus. We can try some things remotely first, or you can bring it in for a full tune-up."
Ask about data backup: Yes
Service type: Flat Rate | Remote first
Pricing: $125–$200
Turnaround: 1–3 business days
Internal notes: HDD failing, malware, too many startup apps, low RAM.

#15 — "No bootable device" or "Operating system not found"
Symptoms: Seeing "No bootable device" or "Operating system not found" message.
Follow-up questions: Did this start suddenly or after an update? Were you making any changes to the computer? Do you hear any unusual sounds when it tries to start?
Script: "That message usually means the computer can't find the drive with your operating system. Could be the drive itself or the system files. We'll diagnose it and save your data if possible."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: Dead HDD/SSD, corrupted boot, loose cable. Data recovery may be needed.

#16 — Laptop hinge broken / cracked / stiff
Symptoms: Laptop hinge is broken, cracked, or really stiff.
Follow-up questions: Can you still open and close the laptop? Is the screen still working? Do you see any cracks around the hinge area? What brand and model is it?
Script: "Hinge issues are common and usually repairable. We'd need to see the laptop to check if it's the hinge itself or the housing around it. Bring it in and we'll quote it."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: Varies by model (quote after inspection)
Turnaround: 3–7 business days
Internal notes: Hinge + housing may both need replacement.

#17 — Laptop battery dies in an hour or less
Symptoms: Laptop battery dies in an hour or less.
Follow-up questions: How old is the laptop? Have you checked battery health in settings? Does it get hot when on battery? Has it always been this way or did it change suddenly?
Script: "Sounds like the battery needs replacing. We can handle that — bring it in and we'll confirm the model and get it swapped out."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: Varies by model (quote after inspection)
Turnaround: 1–3 business days
Internal notes: Battery replacement. Check model for part availability.

#18 — Trackpad not working / clicking on its own / jumping around
Symptoms: Trackpad isn't working, clicking on its own, or jumping around.
Follow-up questions: Is it completely dead or just acting erratic? Did you spill anything on the laptop? When did this start?
Script: "Could be the trackpad itself or a connection issue inside. We'll need to open it up and test. Bring it in and we'll take a look."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Trackpad failure, ribbon cable, water damage, swollen battery pressing on trackpad.

#19 — USB ports not working
Symptoms: USB ports aren't working on computer.
Follow-up questions: What do you have plugged in? Did you trip over a cord? Did this start after an update? Desktop or laptop?
Script: "Could be a software issue or something with the ports themselves. If it's all of them, it might be the board. We'll need to test it."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: USB controller failure, driver corruption, motherboard.

#20 — HDMI port not working / no display on external monitor
Symptoms: HDMI port isn't working or no display on external monitor.
Follow-up questions: Does the laptop screen still work? Did this work before? Did you change any display settings? Was there an update or new software installed?
Script: "Could be the cable, the port, or a driver issue. Try a different cable first. If that doesn't help, bring it in and we'll test the port."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: HDMI port, driver, GPU output failure.

#21 — Wi-Fi keeps disconnecting / won't connect
Symptoms: Wi-Fi keeps disconnecting or won't connect at all.
Follow-up questions: Did you install new internet in your home? Did this start after an update? Are you close to the router?
Script: "Could be a driver issue or the wireless card. We can try troubleshooting remotely first. If it's hardware, you'd need to bring it in."
Ask about data backup: No
Service type: Flat Rate | Remote first
Pricing: $110–$160
Turnaround: 1–3 business days
Internal notes: Wi-Fi card, driver, antenna. Remote if driver issue.

#22 — No sound at all
Symptoms: No sound coming from computer at all.
Follow-up questions: Did you drop or spill anything on it? Did this start after an update or installing something? Desktop or laptop?
Script: "Could be a driver issue or the speakers themselves. We can try to fix it remotely first. If it's a hardware problem, you'd need to bring it in."
Ask about data backup: No
Service type: Flat Rate | Remote first
Pricing: $90–$150
Turnaround: 1–3 business days
Internal notes: Audio driver, speaker failure, audio IC.

#23 — Stuck in update loop / keeps restarting
Symptoms: Computer stuck in an update loop, keeps restarting.
Follow-up questions: How long has it been doing this? Did you try turning it off and back on? Was it a Windows update or something else? Do you get anything on the screen?
Script: "Update loops can sometimes be fixed without losing data. We'd need to take a look. Bring it in and we'll get it sorted."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Corrupted update, failing drive, boot loop. May need OS reinstall.

#24 — Can't connect to printer / won't print
Symptoms: Can't connect to printer or it won't print.
Follow-up questions: Is the printer connected via WiFi? Can other computers print to it? Did this work before? Did anything change — new router, update?
Script: "Printer issues are usually a connection or driver problem. We can try to fix this remotely. If it needs hands-on setup, we can schedule a visit."
Ask about data backup: No
Service type: Flat Rate | Remote first
Pricing: $90–$130
Turnaround: Same day – 1 business day
Internal notes: Driver, network config, spooler.

#25 — Windows login password not working / locked out
Symptoms: Windows login password isn't working or locked out.
Follow-up questions: Do you see any error message? Did someone else change the password? Can you get to the login screen?
Script: "We can usually recover access. For security reasons, we'll need to verify ownership. Bring it in with your ID and we'll get you back in."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $100–$150
Turnaround: Same day – 1 business day
Internal notes: Password reset. Verify ownership. May need OS tools.

--- GAMING PCs ---

#26 — Gaming PC shows BIOS but Windows won't load
Symptoms: Gaming PC shows BIOS screen but Windows won't load.
Follow-up questions: Did you build it yourself or was it pre-built? Did you try to install a new hard drive? Any BIOS or Windows updates before this? Did you unplug or swap any drives?
Script: "Sounds like the OS isn't loading. We'll check the drive, back up your files if needed, and get Windows reinstalled. Our diagnostic is $150 and goes toward the repair."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: Corrupted OS, BIOS misconfig, failed/disconnected drive.

#27 — Gaming PC crashes only during games
Symptoms: Gaming PC crashes only when playing games, browsing is fine.
Follow-up questions: When did the crashing start? Did you update any drivers or mods recently? Does it crash on all games or just one? Have you moved or bumped the PC recently?
Script: "Gaming crashes usually come from overheating, driver conflicts, or power supply issues. We'll stress test it and figure out the cause. Our diagnostic is $150."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: PSU wattage, overheating GPU/CPU, failing GPU, driver conflict.

#28 — Gaming PC overheating / fans screaming
Symptoms: Gaming PC is overheating and fans are screaming.
Follow-up questions: Have you cleaned it out recently? Are you running stock cooling or aftermarket? How old is the build? Does it shut down from the heat?
Script: "Overheating is very common in gaming PCs. We'll clean it, repaste the CPU/GPU, and check the cooling. Usually a quick fix."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $120–$180
Turnaround: 1–2 business days
Internal notes: Dust, thermal paste, fan failure.

#29 — No display on gaming PC / monitors stay black
Symptoms: No display on gaming PC, monitors stay black.
Follow-up questions: Do the fans spin when you power it on? Any beeps or lights? Did you recently change any hardware — GPU, RAM? Have you tried a different cable or monitor?
Script: "Could be the graphics card, the cable, or the motherboard slot. We'll need to diagnose it. Our diagnostic is $150."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 1–3 business days
Internal notes: Reseat GPU, test PSU rails, check PCIe slot.

#30 — FPS drops badly after 10-15 minutes of gaming
Symptoms: Game FPS drops badly after 10–15 minutes of playing.
Follow-up questions: Does it recover if you wait, or does it stay slow? Does the inside feel hot? Did this just start happening? Any new software or updates?
Script: "Performance drops after a set time usually point to thermal throttling. We'll stress test it and check the thermals. Bring it in."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: Thermal throttling, GPU driver, background processes.

#31 — Weird lines / squares / colors on screen during games
Symptoms: Weird lines, squares, or colors on screen during games.
Follow-up questions: Does it happen on the desktop too or only in games? Did this start suddenly? Have you overclocked anything? How old is the graphics card?
Script: "Screen artifacts often point to a graphics card issue. Could be overheating or the card starting to fail. We'll test it under load."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: GPU failure, overheating, bad display cable, VRAM issue.

#32 — PC fans spin to max on boot and stay loud
Symptoms: PC fans spin up to max on boot and stay loud the whole time.
Follow-up questions: Has it always done this or is it new? Did you change anything in the BIOS? How many fans does it have? Is the PC running hotter than usual?
Script: "That could be a fan curve setting in the BIOS or a sensor issue. We'll take a look at the fan configuration and test the hardware."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 1–3 business days
Internal notes: Bad fan curve, motherboard sensor fault, firmware bug.

#33 — Gaming PC gets black screens while playing
Symptoms: Gaming PC gets repeated black screens while playing.
Follow-up questions: Does the whole PC crash or just the screen? Do you hear the game audio still playing? Does it come back on its own? What GPU and PSU do you have?
Script: "Black screens during gaming need to be tested under load. Could be the graphics card, power supply, or drivers. We'll stress test the whole system."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days
Internal notes: GPU thermal fail, driver crash, PSU spike.

#34 — Wi-Fi disconnects during online games
Symptoms: Wi-Fi keeps disconnecting in the middle of online games.
Follow-up questions: Is it just during games or all the time? Are you on Wi-Fi or wired? Does it happen with only one game or all games? Did your ISP install a new modem or router?
Script: "Wi-Fi dropout during games can be the wireless card or a driver issue. If you can run ethernet, try that as a test. If it's hardware, we'll swap it."
Ask about data backup: No
Service type: Diagnostic | In-Office
Pricing: $110–$160
Turnaround: 1–3 business days
Internal notes: Bad Wi-Fi card, antenna, driver, thermal instability.

--- GAMING PC UPGRADES & MAINTENANCE ---

#35 — Want power supply replaced
Symptoms: Customer wants PSU replaced.
Follow-up questions: Why do you think you need a new power supply? Do you already have a new PSU or do you need us to source one? Do you know the wattage you need? What GPU are you running?
Script: "No problem — we can swap that out for you. Bring the PC in, and if you have the new PSU, bring that too."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $130–$190 + parts
Turnaround: 1–2 business days
Internal notes: Customer-requested upgrade. No diagnostic needed.

#36 — Want to add another hard drive
Symptoms: Customer wants to add another hard drive or SSD to PC.
Follow-up questions: Do you have the drive already? SSD or HDD? NVMe or SATA? Do you need anything transferred to it? Windows 10 or 11?
Script: "Easy install. Bring the PC and the drive in, we'll have it done quick."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $90–$120 + parts
Turnaround: Same day – 1 business day
Internal notes: Install only. No data migration or OS tasks.

#37 — Want liquid cooler / AIO installed
Symptoms: Customer wants AIO liquid cooler installed.
Follow-up questions: Do you have the cooler already? Do you know if it fits your case? What motherboard, CPU, and case do you have?
Script: "We can install that for you. Bring the PC and the cooler in, and we'll make sure everything fits and works."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $120–$150
Turnaround: 1–2 business days

#38 — Want RAM upgrade
Symptoms: Customer wants more RAM or a RAM upgrade.
Follow-up questions: Do you know what RAM you currently have? Have you bought the new RAM already? What are you using the PC for?
Script: "RAM upgrade is quick. Bring it in and we'll get it installed. If you need help picking the right RAM, we can check compatibility."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $80–$110
Turnaround: Same day

#39 — Want new graphics card installed
Symptoms: Customer wants a new GPU installed.
Follow-up questions: Do you have the new GPU? Do you know if your power supply can handle it? Need drivers setup too? What power supply do you currently have?
Script: "We'll install the card and make sure it's working. Bring the PC and the GPU in."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $90–$130
Turnaround: Same day – 1 business day
Internal notes: Physical install only. Driver setup extra if needed.

#40 — Full dust cleaning and maintenance
Symptoms: Customer wants dust cleaning and maintenance on gaming PC.
Follow-up questions: How long since it was last cleaned? Any issues — heat, noise, slow down, crashing? Stock cooling or custom?
Script: "We'll do a full internal cleaning, repaste the CPU and GPU, and check all the fans. Bring it in."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $90–$130
Turnaround: 1–2 business days

#41 — Want Windows reinstalled fresh
Symptoms: Customer wants Windows reinstalled clean on gaming PC.
Follow-up questions: Do you need any files saved before we wipe it? Do you have a Windows key? Any specific software you need reinstalled after?
Script: "We can do a clean install. If you need your data saved, we'll handle that first. Bring it in."
Ask about data backup: Yes
Service type: Flat Rate | In-Office
Pricing: $130–$185
Turnaround: 1–2 business days
Internal notes: $185 if data backup included.

#42 — Want to move everything to a new PC case
Symptoms: Customer wants everything moved into a new PC case.
Follow-up questions: Do you have the new case already? Do you know if all your parts will fit? Custom cooling or stock? What's the current setup?
Script: "Full case swap — we'll move everything over and cable manage it. Bring both the PC and the new case in."
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $180–$250
Turnaround: 2–3 business days

--- SURFACE DEVICES (HIGH RISK — ALWAYS WARN CUSTOMER) ---

#43 — Surface Pro won't turn on
Symptoms: Surface Pro won't turn on at all.
Follow-up questions: Did you drop it or spill liquid? Was there a power surge? Any recent updates? How old is the Surface?
Script: "Surface devices require very careful teardown. We'll need to open it to test power and internal components. ⚠️ There is some risk the screen may crack during disassembly — we always disclose that upfront."
⚠️ WARNING: ALWAYS warn customer about screen breakage risk before accepting this job.
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $200 deposit (applied to repair)
Turnaround: 4–7 business days
Internal notes: Firmware, battery, motherboard.

#44 — Surface screen is cracked
Symptoms: Surface screen is cracked.
Follow-up questions: Can you still see anything on the screen? Does it work on an external monitor? What model is it? Any other damage?
Script: "We can replace the screen. These devices need very careful handling. We'll need a deposit and we'll confirm parts availability for your model."
⚠️ WARNING: Get model number. Check frame for prior damage.
Ask about data backup: No
Service type: Flat Rate | In-Office
Pricing: $150–$200 deposit (model-dependent)
Turnaround: 5–10 business days

#45 — Surface battery dies fast / won't hold charge
Symptoms: Surface battery dies really fast or won't hold a charge.
Follow-up questions: How old is the device? What battery health shows in settings? Does it get hot? How fast does it drain?
Script: "Battery replacement on Surface devices is complex — the screen has to come off. There's some risk involved and we'll need you to acknowledge that in writing before we proceed."
⚠️ WARNING: HIGH RISK — screen may break during battery swap. Written acknowledgment required.
Ask about data backup: Yes
Service type: Flat Rate | In-Office
Pricing: $200 deposit
Turnaround: 5–10 business days

--- DATA RECOVERY & OS SERVICES ---

#46 — Need files recovered from dead computer
Symptoms: Need files recovered from a dead or broken computer.
Follow-up questions: Does the computer power on at all? What files do you need most — photos, documents, work files? Roughly how much data? Has anyone else tried to fix it?
Script: "We'll attempt to recover your data. Our evaluation fee is $185 and that goes toward the recovery if we're successful."
Ask about data backup: N/A
Service type: Flat Rate | In-Office
Pricing: $185 evaluation fee (applied to recovery). Advanced = custom quote.
Turnaround: 2–7 business days
Internal notes: $185 basic attempt. $250 if <500GB recovered.

#47 — Computer needs fresh start / reinstall
Symptoms: Computer is slow and needs a fresh start or reinstall.
Follow-up questions: Do you need to keep any of your files? Roughly how much data? Do you already have a backup? Personal or business use?
Script: "We can do a fresh OS install. If you need your files saved, we'll handle that first. Bring it in and we'll scope it out."
Ask about data backup: Yes
Service type: Flat Rate | In-Office
Pricing: $185 (no data), $300 (with data under 500GB)
Turnaround: 2–4 business days

#48 — Need data transferred from old computer to new one
Symptoms: Need data transferred from old computer to new computer.
Follow-up questions: How much data do you think you have? Is the old computer still working? Mac or PC? Both the same? What needs to be transferred — everything or just certain files?
Script: "We do data transfers all the time. Price depends on the amount of data. Bring both computers in and we'll get it done."
Ask about data backup: N/A
Service type: Flat Rate | In-Office
Pricing: 500GB=$200 / 1TB=$275 / 1.5TB=$350 / 2TB=$400. Over 2TB = custom quote.
Turnaround: 1–3 business days

#49 — Need files pulled off computer before recycling or reinstall
Symptoms: Need files pulled off computer before recycling or wiping.
Follow-up questions: Is the computer still working? What files do you need — everything or specific ones? Do you have an external drive to put them on? How much data roughly?
Script: "No problem — we'll pull everything you need before we do anything. Bring it in and let us know what's important."
Ask about data backup: N/A
Service type: Flat Rate | In-Office
Pricing: $125–$185
Turnaround: Same day – 2 business days

#50 — External hard drive not detected / won't show up
Symptoms: External hard drive isn't being detected or won't show up.
Follow-up questions: Is it a hard drive or SSD? Does the light come on when plugged in? Do you hear it spinning or clicking? Are there specific files or folders you need?
Script: "Could be the enclosure, the cable, or the drive itself. Bring it in and we'll test it. If there's data you need, we'll try to recover that first."
Ask about data backup: N/A
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 1–5 business days

--- SOFTWARE & OS ISSUES ---

#51 — "Repairing disk errors" and won't finish
Symptoms: Computer says "Repairing disk errors" and won't finish.
Follow-up questions: How long has it been stuck? Did it start after an update or power outage? How old is the computer? Have you run any commands?
Script: "That usually means the drive is trying to fix itself. If it's been stuck a long time, the drive may be failing. Bring it in so we can check the drive health and save your data."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–4 business days

#52 — Mac stuck on spinning wheel / won't finish booting
Symptoms: Mac is stuck on the spinning wheel and won't finish booting.
Follow-up questions: How long has it been doing this? Did you update macOS recently? How old is the Mac?
Script: "Mac boot issues can be the drive or the system software. We'll run diagnostics and get it sorted. Bring it in."
Ask about data backup: Yes
Service type: Diagnostic | In-Office
Pricing: $150 diagnostic (applied to repair)
Turnaround: 2–5 business days
Internal notes: macOS corruption, failing SSD, T2 chip issue.

#53 — Popups / browser keeps redirecting to weird sites
Symptoms: Getting popups and browser keeps redirecting to weird sites.
Follow-up questions: Did you open an email or click a link? Did you download anything? Did you click on anything suspicious? Did anyone call you?
Script: "Sounds like malware or adware. We can usually clean this up remotely. Do you have internet on the computer?"
Ask about data backup: No
Service type: Flat Rate | Remote first
Pricing: $125–$175
Turnaround: 1–2 business days

#54 — Need help setting up new computer and moving old stuff over
Symptoms: Customer needs help setting up new computer and migrating from old one.
Follow-up questions: Mac or PC? What do you need set up — email, printer, software? How much data needs to come from the old one? Is the old computer still working?
Script: "We can set up the new machine and transfer everything from your old one. Bring both in and we'll take care of it."
Ask about data backup: N/A
Service type: Flat Rate | In-Office
Pricing: $200–$300
Turnaround: 1–3 business days

--- BUSINESS & SERVER ---

#55 — Office server won't boot / nobody can access files
Symptoms: Office server won't boot or nobody can access their files.
Follow-up questions: How many people are affected? Any error messages on the server screen? Was there a recent power outage? Are you running backups? What error do you see?
Script: "Server issues affect your whole team, so we treat these as priority. We can dispatch a technician or have you bring it in — which works better for your situation?"
Ask about data backup: Yes
Service type: Consultation | On-Site preferred
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day response

#56 — Software everyone uses stopped working / nobody can log in
Symptoms: A software the whole office uses stopped working or nobody can log in.
Follow-up questions: Which software? Is it hosted on a local server or in the cloud? Did anyone run updates recently? How many people are affected?
Script: "This is likely a server or licensing issue. We may be able to start remotely — can someone give us remote access to the server?"
Ask about data backup: N/A
Service type: Consultation | Remote first
Pricing: $200/hr (remote or on-site)
Turnaround: Same day – 2 business days

#57 — Nobody in office can access shared folders
Symptoms: No one in the office can access the shared folders.
Follow-up questions: Can everyone still get on the internet? Did anyone change anything on the server? Was there a power outage or restart? How many people are affected?
Script: "Sounds like the file server may be down. This is something we can usually resolve on-site fairly quickly. We'll get someone out there."
Ask about data backup: N/A
Service type: Consultation | On-Site
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day response

#58 — Server keeps rebooting by itself
Symptoms: Server keeps rebooting by itself throughout the day.
Follow-up questions: How often does it restart? Do you see any error screens before it reboots? Has anything been updated recently? Is the server room hot?
Script: "Intermittent server reboots can be hardware or software. We'd need to diagnose it — this is something we'd come to you for."
Ask about data backup: Yes
Service type: Consultation | On-Site
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day response

#59 — Employees can't log in / Active Directory down
Symptoms: Employees can't log into their computers or Active Directory is down.
Follow-up questions: Can anyone log in or is it everyone? Is the server still running? Were there any recent changes — new employees, password policies? Any specific error message?
Script: "If nobody can log in, it's likely the domain controller. This is critical — we'll prioritize getting someone out there."
Ask about data backup: N/A
Service type: Consultation | On-Site
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day response

#60 — Can't remote into server / RDP or VPN not working
Symptoms: Can't remote into server, RDP or VPN isn't working.
Follow-up questions: When did it stop working? Can you access the server physically? Any firewall or router changes recently? Is the internet working at the office?
Script: "Remote access issues can be firewall, VPN, or the server itself. If someone is at the office, they might be able to help us check a few things remotely. Otherwise, we'll come to you."
Ask about data backup: N/A
Service type: Consultation | Remote or On-Site
Pricing: $200/hr
Turnaround: Same day – 1 business day

#61 — Backup software failed / last backup didn't complete
Symptoms: Backup software failed or last backup didn't complete.
Follow-up questions: What backup software are you using? When was the last successful backup? Did you get an error message? How much data is being backed up?
Script: "Backup failures need to be addressed quickly. We can usually look at this remotely. Do you have someone who can give us remote access to the server?"
Ask about data backup: N/A
Service type: Consultation | Remote first
Pricing: $200/hr
Turnaround: Same day – 1 business day

#62 — Server making clicking or grinding noises
Symptoms: Server is making clicking or grinding noises.
Follow-up questions: How long has it been making this noise? Is it still running normally? How old is the server? Do you have current backups?
Script: "Clicking noises from a server usually mean a hard drive is about to fail. This is urgent — we need to get backups verified and that drive replaced as soon as possible."
Ask about data backup: Yes
Service type: Consultation | On-Site — URGENT
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day — URGENT

#63 — Power outage and server won't come back up
Symptoms: Had a power outage and server won't come back up.
Follow-up questions: Is there a UPS battery backup on the server? Do you see any lights or error messages? Did the server shut down gracefully or hard crash? Do you have recent backups?
Script: "Power outages can cause boot issues, especially if the server didn't shut down properly. We'll need to come check it — this is priority."
Ask about data backup: Yes
Service type: Consultation | On-Site — URGENT
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day — URGENT

#64 — Security alerts / unauthorized login attempts on server
Symptoms: Getting security alerts or unauthorized login attempts on server.
Follow-up questions: What kind of alerts are you seeing? When did they start? Has anyone's password been compromised? Do you have any remote access open to the internet?
Script: "Security alerts on a server need immediate attention. We'll need to investigate and lock things down. Don't change anything — we'll come to you."
Ask about data backup: Yes
Service type: Consultation | On-Site — URGENT
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day — URGENT

--- NAS & MAC SERVER ---

#65 — Macs can't access shared folder anymore
Symptoms: None of the Macs can access the shared folder anymore.
Follow-up questions: Can you still see the server or NAS on the network? Did anything change — router swap, update? When did it stop working? How many people are affected?
Script: "Could be a network configuration issue or the server itself. We can usually diagnose this remotely or on-site depending on the setup."
Ask about data backup: N/A
Service type: Consultation | Remote or On-Site
Pricing: $200/hr
Turnaround: Same day – 1 business day

#66 — NAS shows red light / beeping constantly
Symptoms: NAS device shows a red light or is beeping constantly.
Follow-up questions: What brand is the NAS — Synology or QNAP? Can you still log into the dashboard? How many drives does it have? Do you have backups of what's on it?
Script: "Red lights and beeping usually mean a drive has failed or is about to. This is urgent — do NOT power it off. We need to look at it right away."
⚠️ WARNING: Tell customer DO NOT power it off.
Ask about data backup: Yes
Service type: Consultation | On-Site — URGENT
Pricing: $200/hr
Turnaround: Same day — URGENT

#67 — Time Machine backups aren't completing / keep failing
Symptoms: Time Machine backups aren't completing or keep failing.
Follow-up questions: Where is Time Machine backing up to — NAS or external drive? When was the last successful backup? Any error messages? How much data?
Script: "Time Machine issues are usually fixable. We can look at this remotely if you can give us access."
Ask about data backup: N/A
Service type: Consultation | Remote
Pricing: $200/hr
Turnaround: 1–2 business days

#68 — Can't log into Synology / QNAP NAS dashboard
Symptoms: Can't log into Synology or QNAP NAS dashboard.
Follow-up questions: Can you access it at all by IP address? Did you change the password recently? Is the NAS showing any lights or errors? Can other devices see it on the network?
Script: "Could be a login, network, or firmware issue. We can try remotely first. If we need physical access, we'll schedule a visit."
Ask about data backup: N/A
Service type: Consultation | Remote first
Pricing: $200/hr
Turnaround: 1–2 business days

--- NETWORK & ON-SITE SERVICES ---

#69 — Need help setting up Wi-Fi / router / modem
Symptoms: Need help setting up Wi-Fi, router, or modem.
Follow-up questions: Are you setting up a brand new router or replacing one? Who is your internet provider? How big is your home/office? Do you have the equipment already?
Script: "Router and modem setup needs to be done at your location — we can't configure that remotely. We'll send someone out to get it all working."
Ask about data backup: N/A
Service type: Flat Rate | On-Site only
Pricing: $150–$200 on-site visit
Turnaround: 1–2 business days
Internal notes: Can't set IP/config at our office. Must be at customer location.

#70 — Office network is down / nobody has internet
Symptoms: Office network is down and nobody has internet.
Follow-up questions: Is it just internet or are internal things down too? Did anything change — new equipment, power outage? Do you have an IT person who's looked at it? How many people are affected?
Script: "Network outages affecting everyone need hands-on troubleshooting. We'll dispatch someone to your location as soon as possible."
Ask about data backup: N/A
Service type: Consultation | On-Site
Pricing: $200/hr on-site (1 hr minimum)
Turnaround: Same day response

--- CSR GOLDEN RULES ---

1. GOAL: Get them in the door or get a deposit. Every call ends with a scheduled drop-off or deposit. Don't let them "think about it" without a next step.
2. DO NOT quote exact prices on the phone. Say: "Every device is different, so we need to take a look first. Our diagnostic is $150 and it goes toward the final repair."
3. If they push for a range, give a general one from the knowledge base. Follow with: "We can't confirm until we diagnose it."
4. Always ask about data: "Do you have important files on this device that you'd need saved?"
5. Always collect device info: Brand, model, serial number. Helps pre-check parts availability.
6. Parts are SEPARATE from labor. "If parts are needed, that's separate from the labor. We can't give a total until we assess it."
7. Default turnaround: 3–4 business days. If parts needed: +5–8 days. International parts: 10–15 days total.
8. Deposits are non-refundable. Covers diagnostic time and bench work. Applied toward final cost.
9. Get approval BEFORE proceeding past diagnostic.
10. Photos BEFORE any work. Document device condition at intake.

--- OBJECTION HANDLING ---

Customer says "Can't you just tell me the price?"
→ "I totally understand. The thing is, every device is a little different — what looks like one issue can sometimes be something else underneath. That's why we start with a diagnostic for $150, and that goes toward your repair. No surprises."

Customer says "That's too expensive."
→ "I hear you. Keep in mind the diagnostic fee covers the full inspection and is applied to the repair — so you're not paying twice. We also warranty our work, which you won't get from a YouTube tutorial."

Customer says "Can you do it remotely?"
→ "Some things we can do remotely, like virus removal or software issues. For hardware problems, we need the device here so we can test it properly. Want me to check if yours qualifies for remote?"

Customer says "I'll think about it."
→ "No problem at all. Just so you know, these issues tend to get worse over time — especially hardware. We'd hate for you to lose data or have a bigger repair later. If you want, I can hold a spot for you this week."

Customer says "My friend/cousin can fix it for cheaper."
→ "That's totally your call. We just want to make sure it's done right the first time — we've seen a lot of devices come in after someone else tried to fix it, and it usually ends up costing more. We warranty our work."

Customer says "How long will this take?"
→ "Typically 3 to 4 business days for most repairs. If parts are needed, that can add a few more days — we'll keep you updated every step of the way."

Customer says "Do you guarantee it'll be fixed?"
→ "We can't guarantee a fix before diagnosing it — that would be irresponsible. But we'll be upfront with you every step. If it's not repairable, we'll let you know and you'll only pay the diagnostic fee."

--- INTAKE CHECKLIST (collect at every drop-off) ---

Required fields: Customer Name, Phone Number, Email, Device Brand + Model, Serial Number, PIN/Password (if needed for diagnosis), Customer's description of problem, Data backup needed, Accessories left (charger, drives, etc.), Photos taken of device (BEFORE any work), Deposit collected, Expected turnaround communicated.

--- REPAIR RISK & DIFFICULTY GUIDE ---

Surface Pro 7+ — Battery Replacement: Difficulty 9/10, 2–3 hrs, VERY HIGH RISK. Screen may crack during battery removal. Customer MUST sign written acknowledgment before we proceed. Compare repair cost to device value.
Surface Pro 7+ — Screen Replacement: Difficulty 7/10, 1.5–2 hrs, MODERATE RISK. Careful prying required. Check frame for prior damage. Take photos before starting.
Surface Book — Battery Replacement: Difficulty 10/10, 3–4 hrs, VERY HIGH RISK. Most complex Surface repair. Very high screen breakage risk. Recommend customer consider replacement if device is 3+ years old.
Surface Book — Screen Replacement: Difficulty 8/10, 2–3 hrs, HIGH RISK. Multiple ribbon cables. Take extreme care.
MacBook Pro (2016+) — Battery Replacement: Difficulty 7/10, 1.5–2 hrs, MODERATE RISK. Adhesive removal required. Battery glued in. Heat + patience needed.
MacBook Pro (2016+) — Keyboard Replacement: Difficulty 9/10, 3–4 hrs, HIGH RISK. Butterfly keyboards require full top case replacement on some models. Verify model first.
MacBook Air (M1/M2) — SSD Upgrade: Difficulty 8/10, HIGH RISK. SSD is SOLDERED on M1/M2 — NOT upgradeable. Inform customer before intake.
MSI Gaming Laptop — Thermal Paste + Fan: Difficulty 6/10, MODERATE RISK. Check for chipset failures — MSI is notorious for these.
Dell XPS 13/15 — Battery Replacement: Difficulty 5/10, LOW RISK. Relatively accessible.
Dell XPS 13/15 — Screen Replacement: Difficulty 6/10, MODERATE RISK. Thin bezels can crack easily.
HP Spectre x360 — Battery Replacement: Difficulty 7/10, MODERATE RISK. Battery is adhesive-mounted. Heat required.
Lenovo ThinkPad — RAM/SSD Upgrade: Difficulty 3/10, LOW RISK. Very serviceable. Easy access panels.
Lenovo ThinkPad — Screen Replacement: Difficulty 4/10, LOW RISK. Well-documented.
iMac (2012–2020) — Hard Drive Replacement: Difficulty 6/10, MODERATE RISK. Screen must come off with suction cups.
iMac (2021+ M1) — Any Internal Repair: Difficulty 9/10, VERY HIGH RISK. Heavily integrated. Most components soldered. Recommend Apple service or replacement.
Any Laptop — Liquid Damage Repair: Difficulty 8/10, HIGH RISK. No guarantees. Corrosion can be hidden and progressive. Disclose honestly.
Any Desktop — Motherboard Replacement: Difficulty 5/10, MODERATE RISK. Verify CPU socket, RAM type, and case compatibility before ordering.
Synology/QNAP NAS — Drive Replacement in RAID: Difficulty 4/10, MODERATE RISK. Verify RAID type first. NEVER remove multiple drives at once.

--- SERVICE CATALOG & DELIVERY ---

REMOTE (can be done without device in-shop):
Virus/malware removal (if system boots), slow computer optimization, pop-up/browser hijack removal, software installation, OS updates/troubleshooting, remote diagnostics, driver updates, system cleanup, email configuration, Office 365/Google Workspace setup, VPN setup, cloud backup setup, printer/scanner setup over network, password resets, screen sharing/client training, syncing services, Microsoft/Apple ID/email account recovery, antivirus setup, security audit, suspicious activity check, phishing support, credential manager setup, data migration via cloud, cloud-based data backup/recovery.

IN-OFFICE (device must be brought to shop):
RAM upgrade, HDD/SSD replacement, motherboard replacement, PSU testing/replacement, CPU replacement/thermal paste, battery replacement (laptops/Surface), fan replacement/overheating repair, keyboard replacement, screen replacement, trackpad repair, charging port replacement/soldering, hinge repair, device won't power on, port repairs (USB/HDMI/audio), Surface Pro hardware repairs (HIGH RISK), water/liquid damage cleaning, board-level repair, data recovery from physically damaged drives, data recovery from drives not detected by BIOS, recovery from clicking/dead drives, USB drives/SD cards with physical damage, advanced RAID recovery, full hardware diagnostics, device teardown, BIOS/UEFI chip reprogramming, secure data destruction.

ON-SITE (must be done at customer location):
Router/modem setup, office network troubleshooting, server hardware diagnostics, NAS installation/configuration, printer/scanner physical setup.

HYBRID (may start remote, escalate to In-Office if needed):
BSOD repair, boot loop/boot failure, OS reinstall, file backup before system wipe, software issues from failing hardware, printer not printing.

--- DEVICE PRICING REFERENCE (INTERNAL — DO NOT SHARE WITH CUSTOMERS) ---

BASE SERVICE PRICING:
- In-Store Diagnostic / Attempt to Repair: $150 (applied toward final cost, non-refundable)
- On-Site Technician Visit: $200/hour (1 hour minimum)
- Rush / Priority Service: $400 (includes diagnostic, pushes to front of queue)
- Fast Shipping (Expedited Parts): $100–$150
- OS Reinstall (no data): $185
- OS Reinstall + Data Transfer <500GB: $300
- Data Transfer up to 500GB: $200
- Data Transfer 1TB: $275
- Data Transfer 1.5TB: $350
- Data Transfer 2TB: $400
- Data Transfer over 2TB: Custom Quote — escalate to technician
- Data Recovery Basic Attempt: $185 (paid upfront)
- Data Recovery Basic + <500GB Restored: $250 total
- Data Recovery Advanced Logical: Custom Quote
- Data Recovery Advanced Hardware (PCB/NAND): $400–$1,200+

GAMING PC BUILD FEES:
- Under $1,000 PC value: $350
- $1,000–$2,000: $450
- $2,000–$4,000: $550
- $4,000–$10,000: $600–$750
- Over $10,000: $1,000+

SURFACE DEVICE PRICING:
- Surface Pro Battery Replacement: $300 labor + $200 deposit — VERY HIGH RISK
- Surface Pro DC Jack Soldering: $300 + $200 deposit — HIGH RISK
- Surface Pro Screen Replacement: $250 + $150 deposit — MODERATE RISK
- Surface Book Battery Replacement: $400 + $200 deposit — VERY HIGH RISK
- Surface Book Screen Replacement: $250 + $150 deposit — MODERATE RISK
- Surface Book DC Jack + Full Teardown: $400 + $200 deposit — HIGH RISK
- MSI Gaming Laptop Thermal Paste/Fan: $250 + $150 deposit — MODERATE RISK

GAMING DESKTOP REPAIR PRICING:
- Overheating/Thermal Throttling: $120–$180
- No Display/GPU Not Detected: $130–$200
- Random Crashing During Games: $150–$220
- PSU Failure: $130–$190 + parts
- Fan Noise/Bad Bearings: $100–$160 + parts
- GPU Driver Corruption: $80–$130
- BSOD/Won't Boot: $150–$250
- Virus/Malware Impact: $120–$180
- SSD/NVMe Failure or Upgrade: $130–$180 + parts
- RAM Diagnosis: $110–$160
- Custom Loop Cooling Leak: $250–$350 + parts
- BIOS Corruption: $120–$180
- Motherboard Failure: $200–$300 + parts
- Cable Management: $100–$140
- Loud Coil Whine/PSU-GPU Noise: $100–$160
- Game Lag from Background Services: $90–$130
- RGB Sync/Lighting Malfunction: $90–$130
- Faulty USB Ports or Headers: $100–$160
- Sound Card/Audio Jack Issues: $110–$170
- Network Card/Wi-Fi Dropouts: $110–$160

LAPTOP & DESKTOP REPAIR PRICING:
- Computer won't power on: $150–$300
- Turns on but no display: $150–$275
- Blue screen (BSOD): $150–$250
- Random crashing or freezing: $150–$250
- Extremely slow performance: $125–$200
- Loud fan/overheating: $125–$225
- Hinge loose/cracked/broken: $150–$275 + parts
- Battery won't hold charge: $125–$225 + parts
- Trackpad unresponsive/glitchy: $100–$200
- Keyboard keys not responding: $100–$250 + parts
- USB ports not working: $100–$200
- HDMI/display port not working: $100–$175
- Wi-Fi won't connect/keeps dropping: $110–$160
- Audio not working/no sound: $90–$170
- Can't connect to printer/network drive: $90–$130
- Laptop screen cracked (still works): $175–$350 + parts
- Laptop screen cracked (no display): $200–$400 + parts
- Computer turns off randomly: $150–$300
- "No bootable device" error: $185–$400
- Fans spin but nothing on screen: $150–$300
- Power button stuck/non-functional: $100–$200

DATA RECOVERY / MIGRATION PRICING:
- Recover files from working laptop: $150–$200
- Recover files from dead laptop (storage intact): $185–$350
- Clone entire drive to new SSD/HDD: $100–$150
- Recover deleted files: $185–$400
- External hard drive not detected: $150–$300
- Transfer files old PC to new PC (<500GB): $200
- Transfer >500GB to external drive: $275–$400
- Transfer data old Mac to new Mac: $200–$300
- Pull files before recycling/reinstall: $125–$185
- Recover photos/documents from damaged PC: $185–$400
- Recover files after virus attack: $185–$350
- PC not booting — recover files only: $185–$300

SOFTWARE / OS ISSUE PRICING:
- Stuck on "Repairing disk errors": $150–$225
- Windows login password lost: $100–$150
- Mac stuck on spinning wheel: $150–$275
- Apps won't open or crash immediately: $125–$200
- Popups/browser hijack/adware: $125–$200
- Reinstall Windows (keep files): $225–$300
- Reinstall macOS (fresh install): $185–$250
- Create bootable USB installer: $75–$100
- PC won't detect external USB devices: $100–$175

UPGRADE SERVICES PRICING:
- Install RAM: $80–$110
- Install SSD or hard drive: $90–$130
- Clone old drive to new SSD: $130–$175
- Install graphics card: $90–$130
- Full PC cleanup + repaste: $125–$175
- Build custom PC (customer supplied parts): $350–$550
- Mount SSD in enclosure: $50–$75
- Set up new computer + move old data: $200–$300
- Set up email, software, printer: $100–$150

BUSINESS SERVER PRICING ($200/hr):
- Standard server diagnosis & repair: $200–$400
- RAID recovery/rebuild: $350–$700
- Active Directory/Domain Controller fix: $300–$500
- VPN/Remote Access fix: $200–$350
- Server OS reinstall + config: $400–$600
- Email server troubleshooting: $250–$450
- Security breach investigation: $400–$800
- Server migration: $500–$1,200
- New domain controller setup: $500–$800
- UPS install + auto-shutdown config: $200–$350
- Server OS upgrade: $400–$700
- Monthly server maintenance retainer: $200–$400/mo
- Virtual server rebuild/restoration: $400–$800
- Setup remote access for all employees: $300–$500
- Review and secure user access rights: $200–$350
- Configure server backups: $200–$400

NAS & MAC SERVER PRICING ($200/hr):
- Initial NAS setup + user share creation: $250–$400
- Setup Time Machine for all workstations: $200–$350
- Configure user permissions for folders: $150–$250
- Migrate from old NAS to new NAS: $350–$600
- Upgrade hard drives in NAS: $250–$450
- Set up remote access (QuickConnect/VPN): $200–$350
- Secure NAS against outside attacks: $250–$400
- Set up backup jobs (NAS to USB/cloud): $200–$300
- Configure failure notifications: $150–$250
- Install Plex or media server: $150–$250
- Rebuild RAID after drive failure: $300–$600
- Sync NAS with cloud services: $200–$300
- Firmware upgrade for NAS: $150–$200
- Join NAS to Active Directory: $300–$450

WORKSTATION / OFFICE COMPUTER PRICING:
- Office server won't boot: $200–$400
- Main shared computer is lagging: $150–$250
- Shared files inaccessible over network: $200–$350
- System won't authenticate to domain: $300–$500
- RAID failure or red light on server: $350–$700
- Computer stuck in update loop: $150–$250
- Can't print from main office computer: $100–$175
- Business software won't launch: $175–$300
- Monitor randomly goes black: $125–$200
- Network mapping issues/drives not loading: $175–$300
- VPN won't connect: $200–$350
`.trim();
