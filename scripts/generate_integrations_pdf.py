# -*- coding: utf-8 -*-
"""
AGCE Third-Party Integrations -- Client PDF
Generates: docs/AGCE_Third_Party_Integrations.pdf
"""
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import datetime, os

# -- Palette --
NAVY        = (15,  23,  42)
BLUE        = (37,  99, 235)
SLATE       = (30,  41,  59)
SLATE_LIGHT = (71,  85, 105)
WHITE       = (255, 255, 255)
OFF_WHITE   = (248, 250, 252)
MUTED       = (148, 163, 184)
TEXT        = (30,  41,  59)
GREEN_BG    = (240, 253, 244)
GREEN_TEXT  = (21, 128,  61)

# -- Data --
SECTIONS = [
    {
        "title": "Compliance & KYC",
        "color": (79, 70, 229),
        "services": [
            ("Didit",
             "KYC provider -- document verification, selfie check, Video KYC (VKYC mandatory for India INR access). Supports Aadhaar/PAN, Emirates ID, and Passport."),
            ("Chainalysis KYT",
             "Real-time transaction screening on all deposits and withdrawals. Enforces OFAC, UN, and EU consolidated sanctions lists. Risk scoring: auto-approve / review / reject."),
            ("CryptoSwift",
             "Travel Rule compliance for transfers above USD 1,000 equivalent. VASP counterparty identification and originator/beneficiary data transmission."),
            ("IPQualityScore",
             "VPN and proxy detection applied at registration and login across all 4 exchange instances."),
        ],
    },
    {
        "title": "Custody & Wallets",
        "color": (5, 150, 105),
        "services": [
            ("Fireblocks",
             "Institutional-grade custody. 4 separate workspaces -- one per exchange instance. Automated deposit detection, withdrawal policy engine, hot/cold wallet rebalancing (max 5% in hot), multi-signature for large withdrawals. Supports BTC, ETH, BNB, Polygon, Solana, Tron, Arbitrum, Optimism."),
        ],
    },
    {
        "title": "Liquidity & Hedging",
        "color": (37, 99, 235),
        "services": [
            ("Binance (Corporate API)",
             "Spot + futures API for net exposure hedging. No direct order routing to end users. Aggregate open interest on perpetuals hedged via futures account."),
            ("Bybit (Corporate API)",
             "Spot + derivatives API. Secondary hedging venue alongside Binance. Used as treasury function for position-based hedging."),
            ("Binance / Bybit / Coinbase (Price feeds)",
             "Spot price feeds. Weighted average used as the mark price index for perpetuals funding rate calculation."),
        ],
    },
    {
        "title": "Market Data",
        "color": (217, 119, 6),
        "services": [
            ("RBI / Bloomberg Feed",
             "Live USD/INR reference rate for the USDT/INR conversion spread engine. India instance only."),
        ],
    },
    {
        "title": "Payments (India Instance Only)",
        "color": (220, 38, 38),
        "services": [
            ("NPCI-Approved Payment Aggregator",
             "UPI deposits and withdrawals. Required for INR fiat integration on AGCE India."),
            ("Bank Integration (IMPS / NEFT / RTGS)",
             "Direct bank transfer support. INR ledger maintained separately from crypto ledger with daily reconciliation against bank nostro account."),
        ],
    },
    {
        "title": "Notifications",
        "color": (168, 85, 247),
        "services": [
            ("SendGrid / AWS SES",
             "Transactional email -- trade confirmations, deposit/withdrawal updates, KYC status, security alerts, anti-phishing code in all platform emails."),
            ("Twilio",
             "SMS OTP for 2FA and SMS notification channel for account security events."),
            ("Firebase (FCM) / Apple APNs",
             "Mobile push notifications for Android and iOS apps (Phase 2)."),
        ],
    },
    {
        "title": "Security & Infrastructure",
        "color": (15, 118, 110),
        "services": [
            ("Cloudflare Enterprise",
             "DDoS protection, IP geofencing at CDN layer, rate limiting. Per-instance country allow/block lists enforced at edge."),
            ("HashiCorp Vault / Cloud KMS",
             "All secrets and API keys managed via Vault or cloud-native KMS (AWS KMS for India, UAE KMS for UAE instances)."),
            ("Palo Alto Networks Cortex",
             "Ongoing VAPT and threat monitoring. Third-party pen testing mandatory pre-launch and annually thereafter."),
        ],
    },
    {
        "title": "Customer Support",
        "color": (14, 116, 144),
        "services": [
            ("Intercom / Zendesk",
             "Live chat embedded in the exchange platform. L1 > L2 > compliance/legal escalation with SLA timers and ticket tracking."),
        ],
    },
    {
        "title": "Regulatory Reporting (Per-Instance)",
        "color": (100, 116, 139),
        "services": [
            ("FIU-IND Portal",
             "Automated STR and CTR filing in required format. India instance only."),
            ("VARA Reporting API",
             "Regulatory report generation and submission. Dubai (VARA-licensed) instance only."),
            ("ADGM / CMA Reporting",
             "Regulatory reporting outputs in ADGM/CMA required formats. Abu Dhabi instance only."),
        ],
    },
]

INFRA = [
    ("Go / Rust",                "Matching engine and risk engine -- low-latency requirement"),
    ("Apache Kafka",             "Inter-service event streaming"),
    ("Redis",                    "Order book state, session data, rate limiting cache"),
    ("PostgreSQL",               "Primary transactional database"),
    ("InfluxDB / TimescaleDB",   "OHLCV and platform metrics -- time-series data"),
    ("Kubernetes + Helm",        "Container orchestration and blue-green deployments"),
    ("Prometheus + Grafana",     "Metrics collection and real-time dashboards"),
    ("ELK Stack",                "Centralised structured logging"),
    ("Jaeger",                   "Distributed tracing across microservices"),
    ("AWS Mumbai (ap-south-1)",  "India instance -- mandatory data residency requirement"),
    ("Huawei Cloud UAE / AWS UAE","UAE instances -- mandatory data residency requirement"),
]

# -- PDF --
class IntegrationsPDF(FPDF):

    def header(self):
        pass  # drawn per-page manually

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 8,
            f"Confidential -- Arab Global Virtual Assets Services LLC SPC  |  Page {self.page_no()}",
            align="C")

    def rule(self, color=SLATE_LIGHT, h=0.3):
        self.set_draw_color(*color)
        self.set_line_width(h)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())

    # -- Cover page --
    def cover_page(self):
        self.add_page()

        # navy header bar
        self.set_fill_color(*NAVY)
        self.rect(0, 0, self.w, 80, "F")

        # logo block
        self.set_fill_color(*BLUE)
        self.rect(20, 22, 16, 16, "F")
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*WHITE)
        self.set_xy(20, 25)
        self.cell(16, 10, "AG", align="C")

        self.set_font("Helvetica", "B", 15)
        self.set_text_color(*WHITE)
        self.set_xy(40, 23)
        self.cell(0, 8, "Arab Global Crypto Exchange", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self.set_font("Helvetica", "", 9)
        self.set_text_color(*MUTED)
        self.set_xy(40, 33)
        self.cell(0, 6, "Arab Global Virtual Assets Services LLC SPC")

        # title
        self.set_xy(20, 96)
        self.set_font("Helvetica", "B", 26)
        self.set_text_color(*TEXT)
        self.multi_cell(0, 12, "Third-Party Integration\nRequirements", align="L")

        self.set_xy(20, self.get_y() + 4)
        self.set_font("Helvetica", "", 11)
        self.set_text_color(*SLATE_LIGHT)
        self.multi_cell(130, 7,
            "Complete catalogue of external services required for\n"
            "the AGCE multi-jurisdiction exchange platform.", align="L")

        # metadata box
        meta_y = 172
        self.set_fill_color(*OFF_WHITE)
        self.set_draw_color(*BLUE)
        self.set_line_width(0.5)
        self.rect(20, meta_y, 170, 52, "DF")

        rows = [
            ("Prepared by",       "Arab Global Virtual Assets Services LLC SPC"),
            ("Principal Officer", "Bhavik Vala"),
            ("Date",              datetime.date.today().strftime("%d %B %Y")),
            ("Version",           "v1.0 -- For Vendor Review"),
            ("Classification",    "Confidential"),
        ]
        y = meta_y + 7
        for label, value in rows:
            self.set_font("Helvetica", "B", 9)
            self.set_text_color(*SLATE_LIGHT)
            self.set_xy(28, y)
            self.cell(46, 6, label)
            self.set_font("Helvetica", "", 9)
            self.set_text_color(*TEXT)
            self.cell(0, 6, value)
            y += 8

        # blue accent at bottom
        self.set_fill_color(*BLUE)
        self.rect(0, self.h - 6, self.w, 6, "F")

    # -- Content page header --
    def page_header_band(self):
        self.set_fill_color(*NAVY)
        self.rect(0, 0, self.w, 18, "F")
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(*MUTED)
        self.set_xy(self.l_margin, 6)
        self.cell(0, 6, "AGCE -- Third-Party Integration Requirements", align="L")
        self.set_xy(0, 6)
        self.cell(self.w - self.r_margin, 6,
                  datetime.date.today().strftime("%d %B %Y"), align="R")
        self.ln(16)

    # -- Section heading --
    def section_header(self, title, color):
        if self.get_y() > self.h - 60:
            self.add_page()
            self.page_header_band()
        self.set_fill_color(*color)
        self.rect(self.l_margin, self.get_y(), 4, 7, "F")
        self.set_xy(self.l_margin + 7, self.get_y())
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*color)
        self.cell(0, 7, title.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.rule(color, 0.35)
        self.ln(2)

    # -- Column header row --
    def table_header(self, c1, c2, c1w):
        self.set_fill_color(*SLATE)
        self.rect(self.l_margin, self.get_y(),
                  self.w - self.l_margin - self.r_margin, 8, "F")
        self.set_xy(self.l_margin, self.get_y() + 1.5)
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(*WHITE)
        self.cell(c1w, 5, c1.upper())
        self.cell(0,   5, c2.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    # -- Service data row --
    def service_row(self, name, desc, shade):
        C1W = 52
        C2W = self.w - self.l_margin - self.r_margin - C1W
        start_y = self.get_y()

        # measure height needed for description
        self.set_font("Helvetica", "", 9)
        lines = self.multi_cell(C2W, 5, desc, dry_run=True, output="LINES")
        row_h = max(len(lines) * 5 + 6, 13)

        if self.get_y() + row_h > self.h - 20:
            self.add_page()
            self.page_header_band()
            self.table_header("Service / Provider", "Purpose & Scope", C1W)
            start_y = self.get_y()

        if shade:
            self.set_fill_color(*OFF_WHITE)
            self.rect(self.l_margin, start_y,
                      self.w - self.l_margin - self.r_margin, row_h, "F")

        self.set_xy(self.l_margin, start_y + 2.5)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*TEXT)
        self.multi_cell(C1W - 4, 5, name)

        self.set_xy(self.l_margin + C1W, start_y + 2.5)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*SLATE_LIGHT)
        self.multi_cell(C2W, 5, desc)

        self.set_y(start_y + row_h)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.2)
        self.line(self.l_margin, self.get_y(),
                  self.w - self.r_margin, self.get_y())
        self.ln(1)

    # -- Infrastructure row --
    def infra_row(self, tech, role, shade):
        C1W = 65
        row_h = 8
        start_y = self.get_y()
        if self.get_y() + row_h > self.h - 20:
            self.add_page()
            self.page_header_band()
            self.table_header("Technology", "Role", C1W)
            start_y = self.get_y()

        if shade:
            self.set_fill_color(*OFF_WHITE)
            self.rect(self.l_margin, start_y,
                      self.w - self.l_margin - self.r_margin, row_h, "F")

        self.set_xy(self.l_margin, start_y + 1.5)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*TEXT)
        self.cell(C1W, 5, tech)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*SLATE_LIGHT)
        self.cell(0, 5, role, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.2)
        self.line(self.l_margin, self.get_y(),
                  self.w - self.r_margin, self.get_y())
        self.ln(1)

    # -- Priority callout box --
    def priority_callout(self):
        bx, by = self.l_margin, self.get_y() + 2
        bw = self.w - self.l_margin - self.r_margin
        self.set_fill_color(*GREEN_BG)
        self.set_draw_color(134, 239, 172)
        self.set_line_width(0.5)
        self.rect(bx, by, bw, 22, "DF")
        self.set_xy(bx + 5, by + 4)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*GREEN_TEXT)
        self.cell(0, 5, "MVP Critical -- Unblock in Phase 1:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_xy(bx + 5, self.get_y() + 1)
        self.set_font("Helvetica", "", 9)
        self.cell(0, 5,
            "Fireblocks  |  Didit (KYC)  |  Chainalysis KYT  |  "
            "Binance / Bybit Hedging APIs  |  IPQualityScore")
        self.ln(28)

    # -- Build --
    def build(self):
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(20, 24, 20)

        self.cover_page()

        self.add_page()
        self.page_header_band()

        self.set_font("Helvetica", "", 10)
        self.set_text_color(*SLATE_LIGHT)
        self.multi_cell(0, 6,
            "The following external services are required for the AGCE multi-jurisdiction exchange "
            "platform spanning four regulatory perimeters: India (FIU-IND), Abu Dhabi (CMA/ADGM), "
            "Dubai (VARA), and Global. Services marked as instance-specific are only required for "
            "the relevant deployment.", align="L")
        self.ln(4)

        self.priority_callout()

        for section in SECTIONS:
            self.section_header(section["title"], section["color"])
            C1W = 52
            self.table_header("Service / Provider", "Purpose & Scope", C1W)
            for i, (name, desc) in enumerate(section["services"]):
                self.service_row(name, desc, i % 2 == 0)
            self.ln(5)

        # Infrastructure
        self.section_header("Internal Infrastructure Stack", SLATE_LIGHT)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5,
            "Not third-party API integrations -- internal technology choices required by the specification.")
        self.ln(3)
        C1W = 65
        self.table_header("Technology", "Role", C1W)
        for i, (tech, role) in enumerate(INFRA):
            self.infra_row(tech, role, i % 2 == 0)

        self.set_fill_color(*BLUE)
        self.rect(0, self.h - 6, self.w, 6, "F")


if __name__ == "__main__":
    pdf = IntegrationsPDF()
    pdf.build()
    out = os.path.normpath(
        os.path.join(os.path.dirname(__file__), "..", "docs", "AGCE_Third_Party_Integrations.pdf")
    )
    pdf.output(out)
    print(f"Generated: {out}")
