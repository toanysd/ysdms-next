# YSDMS Comprehensive Business Process Technical Profile

This document reconstructs the **real business flow** from actual customer email threads in `toanysdmail.CSV` and is intended as the primary basis for implementing YSDMS workflow logic.

## 1. Source Basis

This profile is derived from full-thread reading of actual order communications in the email archive uploaded at `docs/mail_analysis/toanysdmail.zip`, including representative lifecycle threads such as:

- `【YSD】新規トレイお見積依頼：AB30トレイ` (new product / new mold / design → sample → production instruction)
- `BUF Carrierトレイ、BUF MG Holderトレイ本型製作依頼` (new formal mold manufacturing + material quote + sample planning)
- `本日受注分注文書 送付の件` (repeat order / production scheduling / subcontractor coordination)
- `5-912159-* HIPSへ切り替え` (material change + mold modification + urgent execution)
- `金型保有に関する取り交わしについて` (mold ownership agreement / asset governance)

The goal is not only to model a single happy path, but to integrate the **full set of recurring real-world cases** into a complete operational process profile.

---

## 2. Core Business Pattern

The actual YSD business does **not** behave like a simple “quote → order → delivery” ERP flow.

Instead, it behaves as a **mold + tray lifecycle business** with repeated branching between:

1. Customer inquiry / consultation
2. Design feasibility review
3. Quotation / cost adjustment
4. Mold handling decision
5. Sample decision and validation
6. Internal production instruction
7. External manufacturing coordination
8. Delivery / inspection / document exchange
9. Repeat order / engineering change / audit / ownership follow-up

A single customer case may move repeatedly between these stages.

---

## 3. Actual Main Business Flow

## Stage A. Opportunity / Request Intake

### Trigger types observed
- New tray quotation request
- Existing tray modification request
- New mold request
- Material change request
- Urgent repeat order request
- Mold photo request
- Mold inventory request
- Mold borrowing / ownership / agreement request
- Delivery note / inspection sheet request
- Complaint / defect / stacking problem / leakage problem

### Typical intake artifacts
- Customer email body
- Attached drawing
- Product code / tray code / mold code
- Requested quantity
- target delivery date
- requested material specification
- sample / paid / free distinction
- destination / ship-to location
- customer-specific quality or documentation requirements

### System requirement
YSDMS must support intake as a **case record**, not just a quote record.

A case can begin before quote issuance and may continue after order, delivery, mold audit, and repeat order.

---

## Stage B. Technical Review / Feasibility Review

This stage appears repeatedly in actual emails and is one of the most important real workflows.

### Typical actions
- Review customer drawing
- Check whether existing mold can be reused
- Check whether mold can be modified
- Check whether full remanufacture is required
- Check wall height / stacking / vacuum hole exposure / cavity layout
- Decide mold size and cavitation
- Decide forming machine compatibility (e.g. ILLIG)
- Decide whether plug data and cutting die drawing are needed

### Key internal actor
- `quan@ysd-pack.co.jp` = design / mold drafting / plug data / die data

### Important real behavior
Sales often replies to the customer **after internal design review**, not immediately after request arrival.

### System requirement
Need workflow objects for:
- design review request
- review result
- technical constraint notes
- mold decision type = `reuse | modify | remake | new`
- forming machine candidate
- cavity count
- tray outer size
- mold size
- cut method
- plug required flag
- die drawing required flag

---

## Stage C. Commercial Proposal / Quotation

Quotation in practice is broader than only one PDF quote.

### What is actually quoted
- Tray unit price
- Mold price
- Mold cut cost
- Material quote
- Sample production fee
- Separate quote by mold or by item
- Price impact due to larger mold size / aluminum cost increase

### Real branching seen in emails
- same product may have quote alternatives: current / modify / remake
- customer may request quote split per mold
- material cost changes after geopolitical/raw-material effects
- customer may ask whether order document should be issued now or at execution timing

### System requirement
Need quote model supporting:
- multiple quote lines per case
- optional scenarios / alternatives
- cost components separated
- status = draft / sent / revised / accepted / expired
- linkage to design review version
- linkage to material quote version

---

## Stage D. Mold Decision / Asset Decision

This is one of the biggest differences between YSD and ordinary sales systems.

### Possible mold states
- Existing YSD-held mold
- Customer-owned mold held at YSD
- Customer sends mold to YSD for modification
- New mold manufacturing required
- Existing mold needs photo / inventory / ownership confirmation
- Mold must be returned after modification
- Mold requires ownership memorandum / borrowing form / asset list maintenance

### Related actual business cases
- mold cut instruction
- mold return deadline after engraving modification
- mold ownership agreement (覚書)
- asset list correction by mold code / dimensions
- mold inventory response to customer
- mold photo + QR label requirement

### System requirement
Need **independent Mold Master + Mold Event Ledger**, not only references inside quote/order.

Minimum mold data:
- mold_code
- tray_code / product_code relation
- customer owner
- current holder
- physical location
- status
- dimensions
- cavity count
- machine compatibility
- ownership doc status
- borrowing doc status
- inventory status
- photo status
- latest audit date
- latest return date
- engraving / revision history

---

## Stage E. Sample Planning and Validation

In real flows, sample is a critical intermediate state.

### Recurrent sample patterns
- free initial sample + paid quantity in same production instruction
- first sample must be approved before paid lot ships
- sample quantity requested urgently before mass quantity
- customer asks if immediate sample production is possible right after first sample confirmation
- inspection sheet may be required for sample

### System requirement
Need separate sample object:
- sample_type = initial / revised / PPAP / trial / pre-mass
- free_or_paid
- quantity
- approval_required
- approval_date
- customer_result
- linked inspection report
- linked shipping note

---

## Stage F. Internal Production Instruction

This stage is highly explicit in the emails and should be modeled exactly.

### Real instruction contents found
- ship date
- forming date
- material + thickness + special properties
- quantity split: free / paid / office use
- destination split
- mold code / lot code
- machine designation
- cut method
- stacking information
- sample note
- office reserve quantity
- same-day production but delayed shipment until sample approval

### Real internal recipients
- operations (`gyoumu`, `gyoumu2`)
- design (`quan`, `toan`)
- sales (`eigyo`)
- president / managers copied for control

### System requirement
Need a first-class **Production Instruction** module.

Fields should include:
- instruction_no
- related case
- related quote/order
- mold codes
- tray codes
- material spec
- thickness
- additive / anti-static / conductive / silicone flags
- quantity breakdown
- machine
- forming date
- shipping date
- delivery destination list
- sample condition
- inspection requirement
- remarks / red-letter corrections / revision log

---

## Stage G. External Manufacturing Coordination

YSD often coordinates with outside processors / factories after receiving customer orders.

### Real examples
- Marudai production schedule confirmation
- machine-by-machine production planning
- material arrival waiting
- mold arrival timing
- same-day shipment cutoff time (e.g. by 15:00)
- scheduling impossible due to machining / polishing / drilling not finished yet

### System requirement
Need subcontract / factory coordination records:
- subcontractor
- factory site
- production schedule response
- machine schedule details
- mold sent date
- mold arrival date
- material arrival date
- shipping cutoff constraint
- risk / delay notes

This should not be stored only in free-text comments.

---

## Stage H. Delivery / Inspection / Customer Submission

Actual emails show that delivery is not the end.

### Required outgoing documents observed
- quotation
- order-related documents
- delivery note (納品書)
- inspection sheet (検査票)
- sample submission info
- mold photos
- asset lists
- borrowing form PDF + Excel + original hardcopy

### System requirement
Need document generation / storage model:
- document_type
- template_type per customer
- generated_at
- generated_by
- sent_to
- version
- signed_stamp_status
- hardcopy_required flag
- attachment archive

---

## Stage I. Repeat Order / Change / Post-Delivery Events

This is critical. Real business cases continue after first delivery.

### Recurrent post-order events
- repeat order with shorter lead time
- delivery acceleration request
- material change (e.g. HIPS change)
- mold engraving modification
- customer asks for sample again
- complaint / defect / leakage / stacking review
- request for mold photos
- periodic mold inventory audit
- mold ownership agreement update

### System requirement
Every case must remain open as a lifecycle thread with child events.

Need event types such as:
- repeat_order
- expedite_request
- engineering_change
- material_change
- mold_modification
- complaint
- audit_request
- photo_request
- ownership_agreement_update

---

## 4. Integrated Business Archetypes

The email data indicates YSDMS must support at least these archetypes:

1. **New tray + new mold**
2. **Existing tray repeat order**
3. **Existing mold modification**
4. **Material change while continuing production**
5. **Urgent delivery acceleration**
6. **Sample-first then mass production**
7. **Customer-owned mold governance**
8. **Mold inventory / photo / asset audit response**
9. **Borrowing-form / ownership-document workflow**
10. **Issue / complaint / redesign loop**

The application should not force all cases through a single rigid pipeline.

---

## 5. Recommended Data Architecture

## 5.1 Principle
Use a **Case-Centered architecture** with specialized modules attached.

### Core root entity
`business_case`

This is the only reliable anchor that can cover all early-stage, mid-stage, and post-delivery processes.

### Recommended major tables / aggregates
- `business_case`
- `case_party`
- `case_message`
- `case_attachment`
- `case_event`
- `technical_review`
- `quotation`
- `quotation_line`
- `customer_order`
- `order_line`
- `sample_request`
- `production_instruction`
- `production_instruction_line`
- `subcontract_schedule`
- `shipment_notice`
- `inspection_report`
- `document_record`
- `mold_master`
- `mold_revision`
- `mold_inventory_event`
- `mold_photo_record`
- `mold_loan_record`
- `mold_ownership_agreement`
- `material_spec`
- `customer_template_rule`
- `audit_request`

---

## 5.2 Essential design rule
Do **not** over-normalize away the original business content.

Many email-derived instructions contain mixed structured + semi-structured data.

Therefore every major entity should include:
- normalized fields for core logic
- `raw_text_snapshot`
- `extra_json`
- attachment references
- revision history

This is necessary to preserve business coverage for edge cases.

---

## 5.3 Required coverage fields

### business_case
- case_id
- case_type
- title
- customer_id
- contact_person_id
- product_family
- priority
- status
- current_stage
- source_channel
- original_email_thread_key
- requested_due_date
- internal_owner
- sales_owner
- design_owner
- operations_owner
- parent_case_id (for repeat / derivative cases)
- raw_text_snapshot
- extra_json

### technical_review
- review_id
- case_id
- requested_by
- reviewed_by
- review_date
- mold_decision_type
- technical_constraints
- machine_candidate
- mold_size
- cavity_count
- tray_outer_size
- cut_method
- plug_required
- die_required
- stacking_requirement
- result_status
- raw_text_snapshot
- extra_json

### quotation_line
- quote_line_id
- quote_id
- item_type (`tray|mold|material|sample|cut_cost|other`)
- item_code
- description
- quantity
- unit
- unit_price
- amount
- scenario_group
- optional_flag
- notes
- extra_json

### sample_request
- sample_id
- case_id
- related_mold_id
- sample_type
- charge_type
- quantity
- approval_required
- customer_feedback
- approval_status
- inspection_required
- ship_to
- extra_json

### production_instruction_line
- instruction_line_id
- instruction_id
- tray_code
- mold_code
- material_name
- thickness
- conductivity_flag
- anti_static_flag
- silicone_flag
- shot_count
- cavity_count
- quantity_free
- quantity_paid
- quantity_office
- forming_machine
- forming_date
- ship_date
- destination
- sample_condition
- remarks
- extra_json

### mold_master
- mold_id
- mold_code
- customer_owner_id
- current_holder_type
- current_location
- mold_status
- dimension_x
- dimension_y
- cavity_count
- compatible_machine
- ownership_type
- photo_required_flag
- latest_photo_date
- inventory_required_flag
- latest_inventory_date
- loan_required_flag
- latest_loan_doc_date
- agreement_required_flag
- latest_agreement_date
- return_due_date
- extra_json

---

## 6. Module Build Order Recommendation

The correct build sequence is **not** “finish all DB first, then think about UI”, and also not “build final UI immediately for all modules”.

The practical recommendation is:

### Step 1. Freeze business case + mold-centered domain model
Build the DB foundation first for:
- case
- message / attachment
- technical review
- mold master
- quote header/line
- production instruction
- document record

### Step 2. Build narrow web input screens for completed stable stages
As soon as one stage’s data structure is stable enough, build a **simple working input UI** for that stage.

Recommended earliest UIs:
1. Case intake
2. Technical review
3. Mold master / mold event
4. Production instruction draft

### Why this is better
Because real business users will expose missing fields only when using screens.
If waiting until the whole DB is “complete”, hidden requirements will remain undiscovered too long.

### But avoid this mistake
Do not build polished final UI/UX too early.
Early screens should be **operational forms**, not final beautiful product screens.

---

## 7. UI Strategy Recommendation

### Recommended approach
Use a **progressive UI strategy**:
- foundational DB and event model first
- immediately after each stable subdomain, create a practical web form
- iterate schema and screen together

### Practical rule
- If data structure is still unknown: do not build full UI
- If main fields and business decisions are already clear: build lightweight UI now
- If a module drives downstream modules (case, technical review, mold, production instruction): build it early

### Conclusion for YSDMS
Yes, you **should build web input UIs step by step** for each business stage once its schema stabilizes enough.
Do **not** wait until the entire database is fully complete.
But the first-generation screens should prioritize completeness and auditability over beauty.

---

## 8. Immediate Next Build Priority

Based on the real email flows, the best implementation order is:

1. `business_case`
2. `technical_review`
3. `mold_master` + mold events
4. `production_instruction`
5. `quotation`
6. `sample_request`
7. `document_record`
8. `inventory / loan / ownership workflows`
9. `repeat order / change event handling`

This order reflects how actual YSD communication works, and it creates the strongest foundation for all later modules such as quotation PDF, inventory audit, borrowing forms, and real process dashboards.
