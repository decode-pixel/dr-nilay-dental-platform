import { TreatmentData } from "../types";

export const treatmentsData: TreatmentData[] = [
  {
    id: "root-canal",
    name: "Root Canal Treatment",
    desc: "Save your natural tooth with advanced endodontic care designed to relieve pain, preserve your tooth, and restore long-term oral health using modern patient-friendly techniques.",
    iconName: "ToothIcon",
    featured: true,
    longDescription: "A root canal is a treatment used to repair and save a tooth that is badly decayed or becomes infected. During a root canal procedure, the nerve and pulp are removed and the inside of the tooth is cleaned and sealed. Without treatment, the tissue surrounding the tooth will become infected and abscesses may form. We use advanced rotary endodontics and local anesthesia to ensure the procedure is as comfortable and pain-free as a regular filling.",
    symptoms: ["Severe toothache", "Prolonged sensitivity to heat or cold", "Discoloration of the tooth", "Swelling and tenderness", "A persistent pimple on the gums"],
    benefits: ["Relieves severe pain and discomfort", "Saves the natural tooth from extraction", "Prevents the spread of infection", "Restores normal biting and chewing", "Highly successful and long-lasting"],
    process: [
      { title: "Consultation & X-Ray", description: "We examine the tooth and take digital X-rays to see the shape of the root canals and determine if there are any signs of infection in a surrounding bone." },
      { title: "Anesthesia", description: "Local anesthesia is administered to numb the area near the tooth. You will remain comfortable and relaxed throughout the procedure." },
      { title: "Pulp Removal", description: "An access hole is drilled into the tooth. The pulp along with bacteria, the decayed nerve tissue and related debris is removed from the tooth." },
      { title: "Cleaning & Sealing", description: "The interior of the tooth is thoroughly cleaned and sealed with a rubber-like material called gutta-percha." },
      { title: "Restoration", description: "A crown or a filling is placed on the tooth to protect it, prevent it from breaking, and restore it to full function." }
    ],
    faqs: [
      { question: "Is a root canal painful?", answer: "With modern techniques and anesthetics, most patients report that they are comfortable during the procedure. For the first few days after treatment, your tooth may feel sensitive, which can be managed with over-the-counter pain medications." },
      { question: "How long does a root canal take?", answer: "A typical root canal procedure takes one to two appointments, lasting about 60 to 90 minutes each, depending on the complexity of the tooth." },
      { question: "Do I need a crown after a root canal?", answer: "Yes, in most cases, a crown is recommended after a root canal to protect the tooth from fracturing, as the tooth can become more brittle after the pulp is removed." }
    ],
    relatedTreatments: ["re-root-canal", "crowns", "extraction"]
  },
  {
    id: "re-root-canal",
    name: "Re-Root Canal Treatment",
    desc: "Expert retreatment to heal persistent infections and restore your tooth's foundation.",
    iconName: "ShieldPlus",
    longDescription: "Sometimes, a tooth that has received root canal treatment fails to heal properly and can become painful or diseased months or even years after treatment. Re-root canal treatment, or endodontic retreatment, involves reopening the tooth, removing the previous filling materials, thoroughly cleaning the canals, and sealing the tooth again.",
    symptoms: ["Pain when biting or chewing", "Swelling in the gums", "Persistent infection", "Sinus issues related to upper teeth"],
    benefits: ["Saves a previously treated tooth", "Relieves recurrent pain", "Clears up persistent infection", "Prevents tooth extraction"],
    process: [
      { title: "Examination", description: "Detailed examination and 3D imaging to understand why the previous treatment failed." },
      { title: "Access & Removal", description: "The tooth is reopened and previous filling materials are carefully removed." },
      { title: "Cleaning", description: "The canals are thoroughly cleaned, reshaped, and disinfected." },
      { title: "Sealing", description: "The canals are filled and sealed with new biocompatible material." },
      { title: "New Crown", description: "A new crown is placed to protect the tooth." }
    ],
    faqs: [
      { question: "Why would a root canal fail?", answer: "A root canal can fail due to narrow or curved canals that weren't fully treated, new decay exposing the filling to bacteria, or a cracked crown." },
      { question: "Is retreatment more complex?", answer: "Yes, retreatment is generally more complex as it involves removing old restorative materials, but our specialists are highly experienced in these procedures." }
    ],
    relatedTreatments: ["root-canal", "crowns", "extraction"]
  },
  {
    id: "fillings",
    name: "Dental Fillings",
    desc: "Restore cavities with tooth-colored, durable fillings for a natural seamless look.",
    iconName: "Sparkles",
    longDescription: "Dental fillings are used to treat tooth decay, repair cracked or broken teeth, and teeth that have been worn down from misuse. We use high-quality composite resins that match the color of your natural teeth, providing a seamless and durable restoration that is both functional and aesthetically pleasing.",
    symptoms: ["Toothache or sharp pain", "Tooth sensitivity to hot, cold, or sweet", "Visible holes or pits in your teeth", "Pain when biting down"],
    benefits: ["Stops the progression of tooth decay", "Restores tooth structure and function", "Blends naturally with your teeth", "Prevents further damage and infection"],
    process: [
      { title: "Diagnosis", description: "We inspect the tooth and use X-rays to determine the extent of the decay." },
      { title: "Preparation", description: "The decayed area of the tooth is carefully removed." },
      { title: "Placement", description: "The composite material is applied in layers and hardened with a special light." },
      { title: "Polishing", description: "The filling is shaped and polished to match the natural contour of the tooth." }
    ],
    faqs: [
      { question: "Are composite fillings durable?", answer: "Yes, modern composite fillings are very durable and can withstand moderate pressure from the constant stress of chewing. They can last many years with proper care." },
      { question: "Does getting a filling hurt?", answer: "No, local anesthesia is used to numb the area around the tooth, making the procedure virtually painless." }
    ],
    relatedTreatments: ["root-canal", "crowns", "preventive"]
  },
  {
    id: "scaling",
    name: "Teeth Cleaning & Scaling",
    desc: "Professional cleaning to remove plaque and tartar for healthy gums and fresh breath.",
    iconName: "Droplet",
    longDescription: "Professional teeth cleaning (scaling and polishing) removes dental plaque, tartar (calculus), and stains from the teeth. This preventive procedure is essential for maintaining healthy gums, preventing tooth decay, and avoiding periodontal disease. It leaves your mouth feeling fresh and your teeth looking brighter.",
    symptoms: ["Bleeding gums when brushing", "Bad breath (halitosis)", "Visible tartar buildup", "Swollen or red gums"],
    benefits: ["Prevents gum disease and cavities", "Freshens breath", "Removes surface stains for a brighter smile", "Improves overall oral health"],
    process: [
      { title: "Examination", description: "A quick examination of your teeth and gums." },
      { title: "Scaling", description: "Using an ultrasonic scaler to gently remove plaque and tartar from above and below the gumline." },
      { title: "Polishing", description: "A high-powered brush and gritty toothpaste are used to remove residual stains and smooth the teeth." },
      { title: "Flossing", description: "Expert flossing to remove any remaining plaque between teeth." }
    ],
    faqs: [
      { question: "How often should I get scaling done?", answer: "We recommend professional scaling and polishing every 6 months, though some patients with a history of gum disease may need it more frequently." },
      { question: "Will scaling damage my enamel?", answer: "No, professional scaling is completely safe and does not damage the tooth enamel. It only removes the harmful deposits on the tooth surface." }
    ],
    relatedTreatments: ["gum-treatment", "preventive", "whitening"]
  },
  {
    id: "crowns",
    name: "Crowns",
    desc: "Custom-fitted caps to strengthen and protect damaged or weakened teeth.",
    iconName: "Crown",
    longDescription: "A dental crown is a custom-made cap that covers a damaged, decayed, or severely worn tooth. Crowns restore the tooth's shape, size, strength, and appearance. We offer various materials, including porcelain and zirconia, which provide exceptional durability and closely mimic the look of natural teeth.",
    symptoms: ["Severely decayed tooth", "Cracked or broken tooth", "Tooth weakened by a large filling", "Discolored or misshapen tooth"],
    benefits: ["Protects a weak tooth from breaking", "Restores an already broken tooth", "Supports a tooth with a large filling", "Improves the cosmetic appearance of a tooth"],
    process: [
      { title: "Preparation", description: "The tooth is reshaped to make room for the crown." },
      { title: "Impression", description: "Digital or physical impressions of the tooth are taken." },
      { title: "Temporary Crown", description: "A temporary crown is placed while the permanent one is being made." },
      { title: "Placement", description: "The permanent crown is checked for fit and color, then cemented into place." }
    ],
    faqs: [
      { question: "How long do dental crowns last?", answer: "With good oral hygiene, a dental crown can last between 10 to 15 years, and often much longer." },
      { question: "Can a crowned tooth get a cavity?", answer: "While the crown itself cannot decay, the natural tooth underneath it can if plaque accumulates at the gumline. Good oral hygiene is essential." }
    ],
    relatedTreatments: ["root-canal", "bridges", "implants"]
  },
  {
    id: "bridges",
    name: "Bridges",
    desc: "Replace missing teeth seamlessly with durable and natural-looking dental bridges.",
    iconName: "Link",
    longDescription: "Dental bridges bridge the gap created by one or more missing teeth. A bridge is made up of two or more crowns for the teeth on either side of the gap and a false tooth/teeth in between. Bridges help restore your smile, maintain the shape of your face, and distribute the forces in your bite properly.",
    symptoms: ["Missing one or more teeth", "Difficulty chewing or speaking", "Bite problems due to shifting teeth"],
    benefits: ["Restores your smile and ability to chew", "Maintains the shape of your face", "Prevents remaining teeth from drifting out of position", "Distributes bite forces properly"],
    process: [
      { title: "Preparation", description: "The abutment teeth (teeth adjacent to the gap) are prepared by recontouring them." },
      { title: "Impressions", description: "Impressions of the teeth are made to serve as a model for the bridge." },
      { title: "Temporary Bridge", description: "A temporary bridge is placed to protect the exposed teeth." },
      { title: "Final Placement", description: "The custom-made permanent bridge is adjusted and cemented into place." }
    ],
    faqs: [
      { question: "How do I clean a dental bridge?", answer: "You will need to brush normally and use a special floss threader or interdental brush to clean underneath the false tooth to keep the gums healthy." },
      { question: "Is a bridge better than an implant?", answer: "Both are excellent options. An implant doesn't require altering adjacent teeth, while a bridge is usually a faster and more cost-effective solution. We will help you choose the best option." }
    ],
    relatedTreatments: ["crowns", "implants", "dentures"]
  },
  {
    id: "extraction",
    name: "Tooth Extraction",
    desc: "Painless and safe removal of severely damaged or decayed teeth.",
    iconName: "Scissors",
    longDescription: "Tooth extraction involves the removal of a tooth from its socket in the bone. We only recommend extraction when a tooth is too badly damaged to be repaired by a filling or crown. We use advanced local anesthetics and atraumatic techniques to ensure the process is virtually painless and recovery is quick.",
    symptoms: ["Severe tooth decay or infection", "Advanced gum disease", "Crowded teeth", "Fractured or irreparably broken tooth"],
    benefits: ["Prevents infection from spreading", "Relieves severe pain", "Prepares the mouth for orthodontic treatment or implants"],
    process: [
      { title: "X-Ray & Assessment", description: "X-rays are taken to plan the best way to remove the tooth." },
      { title: "Anesthesia", description: "The tooth, gum, and bone tissue are numbed with a local anesthetic." },
      { title: "Extraction", description: "The tooth is gently rocked back and forth to widen the socket and is carefully removed." },
      { title: "Aftercare", description: "A gauze pad is placed over the extraction site to control bleeding, and aftercare instructions are provided." }
    ],
    faqs: [
      { question: "Is tooth extraction painful?", answer: "No, the area will be completely numb during the procedure. You may feel pressure, but no pain. We provide instructions for managing any post-procedure discomfort." },
      { question: "What should I eat after an extraction?", answer: "Stick to soft, cool foods like yogurt, pudding, or applesauce for the first few days. Avoid using straws, as the suction can dislodge the blood clot." }
    ],
    relatedTreatments: ["wisdom-tooth", "implants", "bridges"]
  },
  {
    id: "wisdom-tooth",
    name: "Wisdom Tooth Removal",
    desc: "Gentle surgical extraction of impacted or problematic wisdom teeth.",
    iconName: "Activity",
    longDescription: "Wisdom teeth are the last molars to emerge. Often, there isn't enough room in the mouth for them, leading to impaction, pain, and infection. Wisdom tooth removal is a surgical procedure to extract one or more of these third molars. We ensure a comfortable experience with minimal postoperative swelling.",
    symptoms: ["Pain or jaw stiffness near the back of the mouth", "Swollen, red, or bleeding gums", "Difficulty opening your mouth", "Bad breath or an unpleasant taste"],
    benefits: ["Prevents damage to adjacent teeth", "Relieves pain and swelling", "Lowers the risk of oral infections", "Prevents cyst formation"],
    process: [
      { title: "Consultation & 3D Imaging", description: "We evaluate the position of the wisdom teeth and plan the surgical approach." },
      { title: "Anesthesia", description: "Local anesthesia is administered to ensure complete comfort." },
      { title: "Surgical Removal", description: "An incision is made in the gum tissue, and the tooth is carefully removed, sometimes in sections." },
      { title: "Sutures & Recovery", description: "The site is stitched if necessary, and detailed recovery guidance is provided." }
    ],
    faqs: [
      { question: "Do all wisdom teeth need to be removed?", answer: "No, if they are healthy, fully erupted, positioned correctly, and can be cleaned properly, they may not need to be removed." },
      { question: "How long is the recovery?", answer: "Most people recover fully in 3 to 4 days, though it can take up to a week. Swelling and mild discomfort are normal for the first few days." }
    ],
    relatedTreatments: ["extraction", "oral-surgery", "xray"]
  },
  {
    id: "dentures",
    name: "Dentures",
    desc: "Comfortable, custom-made removable replacements for missing teeth.",
    iconName: "Smile",
    longDescription: "Dentures are custom-crafted removable appliances that replace missing teeth and surrounding tissues. We offer both complete and partial dentures designed for a secure fit and natural appearance, restoring your ability to eat, speak confidently, and smile.",
    symptoms: ["Missing all or most of your natural teeth", "Difficulty chewing food", "Sagging facial muscles due to missing teeth"],
    benefits: ["Restores chewing and speaking ability", "Enhances facial appearance and smile", "Custom-fitted for comfort", "Cost-effective solution for multiple missing teeth"],
    process: [
      { title: "Impressions", description: "Accurate impressions of your jaw are taken." },
      { title: "Models & Fitting", description: "Wax models are created to determine the optimal fit, bite, and appearance." },
      { title: "Fabrication", description: "The final denture is custom-crafted in a dental laboratory." },
      { title: "Final Adjustment", description: "The denture is fitted in your mouth, and final adjustments are made for maximum comfort." }
    ],
    faqs: [
      { question: "Will dentures change how I eat?", answer: "Initially, eating may take a little practice. Start with soft foods cut into small pieces and chew slowly using both sides of your mouth." },
      { question: "How do I care for my dentures?", answer: "Brush them daily with a soft-bristle brush and denture cleaner, and soak them overnight in a denture-cleaning solution." }
    ],
    relatedTreatments: ["implants", "bridges", "extraction"]
  },
  {
    id: "gum-treatment",
    name: "Gum Treatment",
    desc: "Advanced care for periodontal disease to restore your gum health.",
    iconName: "Heart",
    longDescription: "Periodontal (gum) disease is an infection of the tissues that hold your teeth in place. It's a major cause of tooth loss in adults. Our gum treatments range from deep cleaning (scaling and root planing) to advanced periodontal therapy, aiming to halt the disease, reduce pocket depths, and promote reattachment of healthy gums.",
    symptoms: ["Swollen, red, or tender gums", "Gums that bleed easily during brushing", "Receding gums", "Persistent bad breath", "Loose teeth"],
    benefits: ["Stops the progression of gum disease", "Prevents tooth loss", "Reduces bad breath", "Improves overall systemic health"],
    process: [
      { title: "Evaluation", description: "Measuring the depth of periodontal pockets to assess the severity of the disease." },
      { title: "Scaling", description: "Removing plaque and tartar from above and below the gum line." },
      { title: "Root Planing", description: "Smoothing the tooth roots to help gums reattach to the teeth." },
      { title: "Maintenance", description: "Regular periodontal maintenance visits to monitor and maintain gum health." }
    ],
    faqs: [
      { question: "Is gum disease curable?", answer: "While advanced gum disease (periodontitis) cannot be completely cured, it can be successfully managed and controlled with professional treatment and excellent home care." },
      { question: "Does deep cleaning hurt?", answer: "We use local anesthetics to numb your gums during scaling and root planing, ensuring you remain comfortable throughout the procedure." }
    ],
    relatedTreatments: ["scaling", "preventive"]
  },
  {
    id: "pediatric",
    name: "Pediatric Dentistry",
    desc: "Friendly and gentle dental care tailored specifically for children.",
    iconName: "Baby",
    longDescription: "Pediatric dentistry focuses on the oral health of children from infancy through the teen years. We provide a welcoming, fun, and fear-free environment. From routine exams and fluoride treatments to sealants and cavity repairs, our goal is to build a foundation for a lifetime of healthy smiles.",
    symptoms: ["First tooth eruption", "Tooth decay or cavities in children", "Thumb-sucking habits", "Need for preventive care"],
    benefits: ["Establishes positive dental experiences early on", "Prevents childhood tooth decay", "Monitors dental development and growth", "Educates children and parents on oral hygiene"],
    process: [
      { title: "Gentle Exam", description: "A friendly, comprehensive examination of the child's teeth, jaw, and bite." },
      { title: "Cleaning & Prevention", description: "Gentle cleaning, followed by fluoride application or dental sealants if needed." },
      { title: "Treatment", description: "Painless repair of any cavities using child-friendly techniques." },
      { title: "Education", description: "Teaching the child proper brushing techniques in a fun way." }
    ],
    faqs: [
      { question: "When should I take my child to the dentist for the first time?", answer: "The American Academy of Pediatric Dentistry recommends a child's first dental visit occur by their first birthday or within six months of the eruption of their first tooth." },
      { question: "How can I prepare my child for the dentist?", answer: "Talk to them positively about the visit. Read books about going to the dentist and avoid using words like 'pain' or 'shot'." }
    ],
    relatedTreatments: ["fillings", "scaling", "preventive"]
  },
  {
    id: "implants",
    name: "Dental Implants",
    desc: "Permanent and natural-looking replacements for missing teeth roots.",
    iconName: "Target",
    longDescription: "Dental implants are the gold standard for replacing missing teeth. An implant is a titanium post surgically placed into the jawbone beneath the gum line, acting as a sturdy root for a replacement tooth (crown). Implants look, feel, and function like natural teeth and prevent bone loss in the jaw.",
    symptoms: ["Missing one or more teeth", "Dissatisfaction with removable dentures", "Desire for a permanent tooth replacement"],
    benefits: ["Functions and looks like a natural tooth", "Prevents bone loss in the jaw", "Does not require altering adjacent teeth", "Highly durable and can last a lifetime"],
    process: [
      { title: "Planning", description: "3D scans are used to precisely plan the implant placement." },
      { title: "Surgical Placement", description: "The titanium implant is placed into the jawbone." },
      { title: "Healing (Osseointegration)", description: "The jawbone heals and fuses around the implant over a few months." },
      { title: "Abutment & Crown", description: "An abutment is attached, followed by a custom-made crown." }
    ],
    faqs: [
      { question: "Is the implant procedure painful?", answer: "Most patients are surprised at how little discomfort they experience. The procedure is done under local anesthesia, and postoperative pain is usually mild and easily managed." },
      { question: "Am I a candidate for dental implants?", answer: "If you have good general health, healthy gums, and enough bone in your jaw to hold an implant, you are likely a good candidate." }
    ],
    relatedTreatments: ["crowns", "bridges", "oral-surgery"]
  },
  {
    id: "braces",
    name: "Braces & Orthodontics",
    desc: "Straighten your teeth and correct your bite with modern orthodontic solutions.",
    iconName: "AlignCenter",
    longDescription: "Orthodontic treatment straightens teeth, corrects misaligned bites, and improves overall oral health and aesthetics. We offer traditional metal braces, ceramic (clear) braces, and clear aligners to cater to patients of all ages, ensuring a beautiful, confident smile.",
    symptoms: ["Crooked or crowded teeth", "Overbite, underbite, or crossbite", "Gaps between teeth", "Difficulty chewing or speaking clearly"],
    benefits: ["Creates a beautiful, straight smile", "Improves oral hygiene by making teeth easier to clean", "Corrects bite issues, reducing jaw strain", "Boosts self-confidence"],
    process: [
      { title: "Consultation & Records", description: "Taking photos, X-rays, and digital scans to create a customized treatment plan." },
      { title: "Placement", description: "Bonding the brackets to the teeth and threading the archwires." },
      { title: "Adjustments", description: "Periodic visits every 4-8 weeks to adjust the wires and monitor progress." },
      { title: "Retention", description: "Removing the braces and providing retainers to keep teeth in their new positions." }
    ],
    faqs: [
      { question: "How long will I need to wear braces?", answer: "Treatment time varies depending on the complexity of the case, but it typically ranges from 12 to 24 months." },
      { question: "Am I too old for braces?", answer: "No! Orthodontic treatment is highly effective for adults as well. We offer discreet options like clear braces and aligners for adult patients." }
    ],
    relatedTreatments: ["smile-design", "pediatric"]
  },
  {
    id: "smile-design",
    name: "Smile Designing",
    desc: "Complete smile makeovers using veneers, contouring, and advanced aesthetics.",
    iconName: "Wand2",
    longDescription: "Smile designing is a comprehensive cosmetic approach to improving the appearance of your smile. It involves analyzing your facial features and dental aesthetics to create a customized plan. Treatments may include porcelain veneers, teeth whitening, gum contouring, and composite bonding to craft the perfect smile.",
    symptoms: ["Chipped or worn teeth", "Stained or discolored teeth", "Uneven or misshapen teeth", "Gaps or slight misalignments"],
    benefits: ["Customized to complement your facial features", "Dramatically improves smile aesthetics", "Boosts self-esteem and confidence", "Long-lasting and natural-looking results"],
    process: [
      { title: "Digital Analysis", description: "Photographs and digital imaging are used to design your ideal smile." },
      { title: "Mock-up", description: "A temporary mock-up may be placed over your teeth so you can preview the final result." },
      { title: "Preparation & Treatment", description: "The teeth are prepared, and treatments like veneers or bonding are meticulously applied." },
      { title: "Final Polish", description: "The restorations are polished to a natural, beautiful shine." }
    ],
    faqs: [
      { question: "What are porcelain veneers?", answer: "Veneers are thin, custom-made shells of tooth-colored porcelain designed to cover the front surface of teeth to improve their appearance." },
      { question: "Is smile designing permanent?", answer: "Treatments like porcelain veneers are highly durable and can last 10-15 years or more with proper care, while other treatments may need occasional touch-ups." }
    ],
    relatedTreatments: ["whitening", "braces", "crowns"]
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    desc: "Brighten your smile safely with our professional whitening treatments.",
    iconName: "Sun",
    longDescription: "Professional teeth whitening is a fast, safe, and effective way to lift stains and lighten the color of your teeth. Unlike over-the-counter products, our clinical whitening treatments use concentrated, safe bleaching agents that deliver dramatically brighter results in just one visit, with minimal sensitivity.",
    symptoms: ["Yellowing teeth", "Stains from coffee, tea, or smoking", "Dull or aging smile"],
    benefits: ["Dramatically brighter smile in one session", "Safe and supervised by dental professionals", "Customized to minimize tooth sensitivity", "Boosts confidence"],
    process: [
      { title: "Shade Assessment", description: "We determine your current tooth shade and discuss your desired results." },
      { title: "Preparation", description: "Your gums and lips are protected with a special barrier." },
      { title: "Application", description: "Professional-grade whitening gel is applied to the teeth and activated." },
      { title: "Reveal", description: "The gel is removed to reveal a noticeably whiter, brighter smile." }
    ],
    faqs: [
      { question: "Does teeth whitening cause sensitivity?", answer: "Some patients experience temporary sensitivity. We use advanced formulas and desensitizing agents to minimize this, and it typically subsides within a day or two." },
      { question: "How long do the results last?", answer: "Results can last from several months to a few years, depending on your diet and oral hygiene habits (e.g., avoiding tobacco and dark-colored beverages)." }
    ],
    relatedTreatments: ["smile-design", "scaling"]
  },
  {
    id: "oral-surgery",
    name: "Oral Surgery",
    desc: "Expert surgical procedures for complex dental and maxillofacial conditions.",
    iconName: "Stethoscope",
    longDescription: "Oral surgery encompasses a range of surgical procedures addressing complex issues of the mouth, jaw, and face. Our clinic is equipped to handle surgical extractions, bone grafting, cyst removals, and implant site preparations in a highly sterile, safe, and comfortable environment.",
    symptoms: ["Impacted teeth", "Jaw bone loss", "Oral cysts or lesions", "Severe facial or dental trauma"],
    benefits: ["Resolves complex dental issues safely", "Prepares the jaw for successful implants", "Removes pathology (cysts/tumors)", "Performed with advanced pain management"],
    process: [
      { title: "Evaluation", description: "Comprehensive clinical exam and 3D radiographic analysis." },
      { title: "Surgical Planning", description: "Detailed discussion of the procedure, risks, and anesthesia options." },
      { title: "Surgery", description: "The procedure is performed under stringent sterile conditions with appropriate anesthesia." },
      { title: "Post-Operative Care", description: "Detailed instructions and follow-up appointments to ensure optimal healing." }
    ],
    faqs: [
      { question: "Will I be awake during oral surgery?", answer: "Depending on the complexity of the procedure and your preference, we offer local anesthesia, conscious sedation, or general anesthesia options." },
      { question: "What is bone grafting?", answer: "Bone grafting is a procedure that replaces or augments missing bone in your jaw, often necessary to provide a solid foundation for dental implants." }
    ],
    relatedTreatments: ["wisdom-tooth", "implants", "extraction"]
  },
  {
    id: "xray",
    name: "Digital X-Ray / RVG",
    desc: "Quick, low-radiation imaging for accurate and instant dental diagnosis.",
    iconName: "Camera",
    longDescription: "Digital Radiography (RVG) allows us to take highly accurate images of your teeth and jawbones instantly. Compared to traditional X-rays, digital X-rays emit up to 90% less radiation. They provide high-resolution images that help us detect hidden decay, bone loss, and root infections with precision.",
    symptoms: ["Unexplained tooth pain", "Need for a comprehensive exam", "Pre-surgical planning"],
    benefits: ["Up to 90% less radiation exposure", "Instant image viewing for faster diagnosis", "High-resolution imaging for precise detection", "Environmentally friendly (no chemicals)"],
    process: [
      { title: "Positioning", description: "A small, comfortable digital sensor is placed in your mouth." },
      { title: "Capture", description: "The X-ray is taken in a fraction of a second." },
      { title: "Analysis", description: "The image is instantly displayed on a monitor for the dentist to review with you." }
    ],
    faqs: [
      { question: "Are dental X-rays safe?", answer: "Yes. Digital X-rays are extremely safe and emit a very low dose of radiation—much less than you are exposed to in daily life from natural environmental sources." },
      { question: "Why do I need X-rays?", answer: "X-rays allow us to see between the teeth and under the gums to detect problems that aren't visible during a visual exam, such as early decay, bone loss, or abscesses." }
    ],
    relatedTreatments: ["consultation", "preventive"]
  },
  {
    id: "emergency",
    name: "Emergency Dental Care",
    desc: "Immediate attention and relief for severe toothaches and dental injuries.",
    iconName: "AlertCircle",
    longDescription: "Dental emergencies can happen at any time. Whether it's a severe toothache, a knocked-out tooth, a broken crown, or sudden swelling, our clinic prioritizes emergency cases to provide fast, compassionate care. We focus on immediately relieving your pain and stabilizing the issue.",
    symptoms: ["Severe, unmanageable toothache", "Knocked-out or broken tooth", "Significant facial swelling", "Bleeding that won't stop"],
    benefits: ["Immediate pain relief", "Prevents permanent tooth loss", "Treats acute infections quickly", "Same-day priority appointments"],
    process: [
      { title: "Triage", description: "Immediate assessment of the emergency to prioritize care." },
      { title: "Pain Management", description: "Administering anesthetics or medication to relieve pain immediately." },
      { title: "Stabilization", description: "Treating the immediate issue (e.g., re-implanting a tooth, draining an abscess)." },
      { title: "Comprehensive Plan", description: "Formulating a plan for any necessary follow-up restorative care." }
    ],
    faqs: [
      { question: "What should I do if my tooth is knocked out?", answer: "Hold the tooth by the crown (top), not the root. Rinse it gently if dirty, and try to place it back in the socket. If that's not possible, keep it in a glass of milk and get to our clinic immediately." },
      { question: "Is a cracked tooth an emergency?", answer: "Yes, a cracked tooth can expose the inner pulp to bacteria and cause severe pain. It should be evaluated and protected as soon as possible." }
    ],
    relatedTreatments: ["extraction", "root-canal", "oral-surgery"]
  },
  {
    id: "preventive",
    name: "Preventive Dental Check-up",
    desc: "Routine check-ups to catch and prevent dental issues before they worsen.",
    iconName: "CheckCircle",
    longDescription: "Preventive dentistry is the foundation of a healthy smile. Regular check-ups allow us to monitor your oral health, perform oral cancer screenings, and catch minor issues like early decay or gingivitis before they become painful and expensive problems. Prevention is always better than cure.",
    symptoms: ["Time for a 6-month checkup", "Desire to maintain oral health", "Minor concerns or sensitivity"],
    benefits: ["Catches dental issues early", "Prevents cavities and gum disease", "Saves money on complex treatments long-term", "Includes oral cancer screening"],
    process: [
      { title: "Visual Exam", description: "Thorough inspection of teeth, gums, and soft tissues." },
      { title: "X-Rays", description: "Taking digital X-rays if due, to check for hidden issues." },
      { title: "Screening", description: "A quick, painless oral cancer screening." },
      { title: "Consultation", description: "Discussing findings and providing personalized oral hygiene advice." }
    ],
    faqs: [
      { question: "How often should I have a dental check-up?", answer: "For most people, we recommend a preventive check-up every six months. Patients with specific risk factors may need more frequent visits." },
      { question: "What is an oral cancer screening?", answer: "It is a routine part of our check-up where we visually and physically examine your oral tissues for any abnormalities or signs of precancerous conditions." }
    ],
    relatedTreatments: ["scaling", "xray", "consultation"]
  },
  {
    id: "consultation",
    name: "Consultation",
    desc: "Comprehensive evaluation and personalized treatment planning with our experts.",
    iconName: "MessageSquare",
    longDescription: "A dental consultation is a dedicated time for you to discuss your oral health goals, concerns, or cosmetic desires with our expert dentists. We conduct a thorough evaluation, listen to your needs, and present tailored, transparent treatment options without any pressure.",
    symptoms: ["Seeking a second opinion", "Planning for a smile makeover", "Discussing complex treatment options like implants", "General dental concerns"],
    benefits: ["One-on-one time with a dental expert", "Clear, transparent treatment planning", "Answers to all your dental questions", "No-pressure environment"],
    process: [
      { title: "Discussion", description: "We sit down to discuss your dental history, concerns, and goals." },
      { title: "Clinical Exam", description: "A comprehensive examination to understand your current oral health status." },
      { title: "Treatment Options", description: "Presenting various treatment options, weighing the pros and cons of each." },
      { title: "Financial Planning", description: "Providing a clear breakdown of costs and timelines for the proposed treatments." }
    ],
    faqs: [
      { question: "How long does a consultation take?", answer: "A comprehensive consultation typically takes between 30 to 45 minutes, depending on the complexity of your case and the questions you have." },
      { question: "Do I need to bring anything to my consultation?", answer: "If you have recent dental X-rays or records from a previous dentist, please bring them. Otherwise, we can take new digital X-rays if needed." }
    ],
    relatedTreatments: ["xray", "smile-design", "implants"]
  }
];
