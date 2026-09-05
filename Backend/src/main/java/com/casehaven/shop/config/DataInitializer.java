package com.casehaven.shop.config;

import com.casehaven.shop.auth.Role;
import com.casehaven.shop.auth.User;
import com.casehaven.shop.auth.UserRepository;
import com.casehaven.shop.inventory.StockMovement;
import com.casehaven.shop.inventory.StockMovementRepository;
import com.casehaven.shop.inventory.StockMovementType;
import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.model.Product;
import com.casehaven.shop.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DataInitializer(ProductRepository productRepository,
                           StockMovementRepository stockMovementRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            // Drop legacy check constraints on orders table so all lifecycle states are allowed
            java.util.List<String> constraints = jdbcTemplate.queryForList(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CONSTRAINTS WHERE TABLE_NAME = 'ORDERS' AND CONSTRAINT_TYPE = 'CHECK'",
                String.class
            );
            for (String c : constraints) {
                try {
                    jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT \"" + c + "\"");
                } catch (Exception ignored) {}
            }
            jdbcTemplate.execute("ALTER TABLE orders ALTER COLUMN payment_status VARCHAR(50)");
        } catch (Exception ignored) {}

        // Seed default users if none exist
        if (!userRepository.existsByEmail("admin@casehaven.kh")) {
            userRepository.save(new User(
                "CaseHaven Administrator",
                "admin@casehaven.kh",
                passwordEncoder.encode("Admin@123456"),
                "012888999",
                "Monivong Blvd, Sangkat Boeung Keng Kang 1",
                "Phnom Penh",
                Role.ROLE_ADMIN
            ));
            userRepository.save(new User(
                "Nha Developer",
                "nha@gmail.com",
                passwordEncoder.encode("Nha@123456"),
                "012345678",
                "Street 106, Sangkat Wat Phnom",
                "Battambang",
                Role.ROLE_CUSTOMER
            ));
            log.info(">>> CaseHaven Seed Data: Admin and Customer users seeded successfully!");
        }

        if (productRepository.count() > 0) {
            return; // Products already initialized
        }

        List<Product> seedProducts = List.of(
            // --- APPLE IPHONE ---
            new Product(
                "CH-IP15PM-MAG-01",
                "AeroShield MagSafe Titanium Case",
                "aeroshield-magsafe-titanium-iphone-15-pro-max",
                Brand.APPLE,
                "iPhone 15 Pro Max",
                Category.MAGSAFE,
                new BigDecimal("34.99"),
                new BigDecimal("42.00"),
                28,
                5,
                "Aerospace-grade titanium bezel with N52 MagSafe magnetic matrix and 13ft drop defense.",
                "Engineered with 38 ultra-strong neodymium N52 magnets for 15W flawless MagSafe alignment. Features brushed titanium-grade anodized camera bezels and dual-layer shock impact dispersion to protect against accidental drops.",
                "MagSafe Compatible, 13ft Drop Certified, Tactile Metal Buttons, Anti-Fingerprint Matte Finish",
                "Material: Aerospace Titanium Alloy & Bayer TPU; Magnet Strength: 12N N52; Drop Rating: 13ft / 4m; Thickness: 1.5mm",
                "Compatible exclusively with Apple iPhone 15 Pro Max (6.7-inch). Full access to USB-C port and Action Button.",
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
                "Natural Titanium, Matte Obsidian, Deep Blue, Alpine White",
                "13ft / 4m Extreme Grade",
                4.9,
                88,
                true
            ),
            new Product(
                "CH-IP15P-SIL-01",
                "CloudTouch Liquid Silicone Case",
                "cloudtouch-liquid-silicone-iphone-15-pro",
                Brand.APPLE,
                "iPhone 15 Pro",
                Category.SILICONE,
                new BigDecimal("19.99"),
                new BigDecimal("25.00"),
                45,
                5,
                "Silky smooth medical-grade liquid silicone with Japanese microfiber scratch lining.",
                "Ultra-soft medical grade liquid silicone exterior with genuine Japanese microfiber interior lining to protect against scratches and micro-dust. Features raised lips around display and camera cluster.",
                "Silky Soft Finish, Microfiber Lining, Screen & Camera Raised Lip, Wireless Charging Friendly",
                "Material: Food-grade Liquid Silicone + Microfiber; Drop Rating: 8ft / 2.5m; Thickness: 1.3mm; Weight: 28g",
                "Compatible with Apple iPhone 15 Pro (6.1-inch). Works with all Qi and Qi2 wireless chargers.",
                "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80",
                "Midnight Black, Stone Gray, Pine Green, Chalk Pink, Navy",
                "8ft / 2.5m Everyday Drop",
                4.8,
                64,
                true
            ),
            new Product(
                "CH-IP15-CLR-01",
                "PrismClear Anti-Yellowing Shield",
                "prismclear-anti-yellowing-iphone-15",
                Brand.APPLE,
                "iPhone 15",
                Category.CLEAR,
                new BigDecimal("16.99"),
                new BigDecimal("22.00"),
                32,
                5,
                "Crystal optical clarity with Bayer UV resin inhibitors resisting yellowing for 180+ days.",
                "German Bayer optical polycarbonate with blue-light UV resin inhibitors that withstand 180 days of intense sunlight without yellowing. Air-cushion corner bumpers absorb 90% of drop energy.",
                "99.9% Optical Transparency, Air-Cushion Corner Bumpers, Scratch Resistant 4H Hardcoat",
                "Material: German Bayer Polycarbonate & Flexible TPU; Clarity: 99.9%; Hardness: 4H Anti-Scratch",
                "Compatible with Apple iPhone 15 (6.1-inch dual camera). Precision speaker and USB-C port cutouts.",
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
                "Crystal Clear, Smoke Tint",
                "10ft / 3m Military Grade",
                4.7,
                52,
                false
            ),
            new Product(
                "CH-IP15PM-LEA-01",
                "Siena Handcrafted Vegan Leather Case",
                "siena-handcrafted-leather-iphone-15-pro-max",
                Brand.APPLE,
                "iPhone 15 Pro Max",
                Category.LEATHER,
                new BigDecimal("38.99"),
                new BigDecimal("48.00"),
                18,
                4,
                "Sustainably sourced Italian bio-based vegan leather with fine grain patina.",
                "Sustainably sourced Italian bio-based vegan leather with fine grain texture that develops a unique patina over time. Finished with precision machined aluminum buttons and camera ring.",
                "Premium Italian Vegan Leather, Machined Aluminum Accent Rings, MagSafe Ready, Rich Tactile Grip",
                "Material: Eco-certified Italian Vegan Bio-Leather; Hardware: Anodized Aircraft Aluminum; MagSafe: Yes",
                "Compatible with iPhone 15 Pro Max (6.7-inch). Action button aluminum tactile cap included.",
                "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
                "Caramel Tan, Espresso Dark Brown, Forest Green, Classic Black",
                "9ft / 2.8m Protection",
                4.9,
                41,
                true
            ),
            new Product(
                "CH-IP14P-WAL-01",
                "Executive Folio Magnetic Wallet Case",
                "executive-folio-wallet-iphone-14-pro",
                Brand.APPLE,
                "iPhone 14 Pro",
                Category.WALLET,
                new BigDecimal("29.99"),
                new BigDecimal("38.00"),
                14,
                3,
                "Luxury 3-card RFID blocking folio wallet with hands-free landscape kickstand.",
                "All-in-one luxury folio case with 3 RFID-blocking credit card slots, a cash compartment, and a foldable multi-angle hands-free kickstand for video calls and entertainment.",
                "RFID Blocking Technology, 3 Card Slots + Cash Sleeve, Horizontal Kickstand, Magnetic Clasp",
                "Slots: 3 Cards + 1 Cash Pocket; Security: RFID Shield 13.56 MHz; Clasp: Dual Magnetic Latch",
                "Compatible with Apple iPhone 14 Pro (6.1-inch). Complete 360-degree screen flip protection.",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "Vintage Walnut Brown, Stealth Black, Oxford Navy",
                "10ft / 3m Full Wrap Protection",
                4.8,
                37,
                false
            ),

            // --- SAMSUNG GALAXY ---
            new Product(
                "CH-S24U-MAG-01",
                "ArmorFlex MagSafe Rugged Case",
                "armorflex-magsafe-samsung-s24-ultra",
                Brand.SAMSUNG,
                "Samsung Galaxy S24 Ultra",
                Category.MAGSAFE,
                new BigDecimal("36.99"),
                new BigDecimal("45.00"),
                25,
                5,
                "Heavy-duty honeycomb armor with MagSafe magnetic array and quick S-Pen eject.",
                "Built specifically for the Galaxy S24 Ultra titanium body. Integrated MagSafe magnetic matrix permits seamless wireless car mount and MagSafe charger attachment with zero magnetic interference on S-Pen.",
                "MagSafe Compatible Array, S-Pen Full Access Port, Honeycomb Impact Core, Raised Bezel Protection",
                "Drop Standard: MIL-STD 810G 516.6; Magnet Array: 38 Neodymium Rings; S-Pen Shielding: Yes",
                "Compatible with Samsung Galaxy S24 Ultra (6.8-inch display). Full wireless PowerShare compatible.",
                "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
                "Titanium Gray, Carbon Matte Black, Military Olive",
                "15ft / 4.5m Mil-STD 810G",
                4.9,
                93,
                true
            ),
            new Product(
                "CH-S24P-SIL-01",
                "PureTouch Liquid Silicone Shell",
                "puretouch-silicone-samsung-s24-plus",
                Brand.SAMSUNG,
                "Samsung Galaxy S24+",
                Category.SILICONE,
                new BigDecimal("18.99"),
                new BigDecimal("24.00"),
                38,
                5,
                "Velvety dust-repellent silicone with ergonomic contours matching S24+ curves.",
                "Velvety soft silicone that repels lint, dust, and fingerprint smudges. Ergonomic contoured edges match the refined curves of the S24+. Inner soft lining prevents micro-abrasions.",
                "Anti-Dust Oleophobic Coating, Microfiber Lined, Ultra Slim 1.2mm Profile, Qi2 Wireless Ready",
                "Finish: Soft-Touch Matte; Inner Material: Velvet Fiber; Thickness: 1.2mm; Weight: 26g",
                "Compatible with Samsung Galaxy S24+ (6.7-inch display).",
                "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
                "Cobalt Violet, Onyx Black, Amber Yellow, Marble Gray",
                "8ft / 2.5m Standard",
                4.7,
                48,
                false
            ),
            new Product(
                "CH-S24U-CLR-01",
                "CrystalFusion Armor Clear Case",
                "crystalfusion-clear-samsung-s24-ultra",
                Brand.SAMSUNG,
                "Samsung Galaxy S24 Ultra",
                Category.CLEAR,
                new BigDecimal("17.99"),
                new BigDecimal("23.00"),
                40,
                5,
                "Showcase titanium brilliance with scratch-resistant backplate and ribbed corner bumpers.",
                "Showcase the natural titanium brilliance of your S24 Ultra with crystal-clarity backplate and shock-absorbing TPU bumper corners. Raised camera bezels guard individual camera lenses.",
                "Non-Slip Ribbed Grips, Precision S-Pen Cutout, Anti-Oil Hydrophobic Surface, Zero Yellowing Guarantee",
                "Hardness: 4H; Bumpers: Corner Air Pocket; UV Resistant: Yes 6 Months",
                "Compatible with Samsung Galaxy S24 Ultra. Precise lens cutouts prevent dust accumulation.",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
                "Clear Diamond, Translucent Frost",
                "12ft / 3.6m Certified",
                4.8,
                62,
                true
            ),
            new Product(
                "CH-S23U-LEA-01",
                "Heritage Horween Leather Case",
                "heritage-leather-samsung-s23-ultra",
                Brand.SAMSUNG,
                "Samsung Galaxy S23 Ultra",
                Category.LEATHER,
                new BigDecimal("35.99"),
                new BigDecimal("44.00"),
                12,
                3,
                "Full-grain saddle leather developing rich character with heat-dissipating aluminum plate.",
                "Crafted from premium full-grain saddle leather. Each case features natural grain variations and subtle distress character that matures with daily handling. Integrated heat dispersion plate.",
                "Full-Grain Top Leather, Heat-Dissipating Aluminum Plate, Soft Suede Interior, Camera Shield Rim",
                "Leather: Full-Grain Vegetable Tanned; Interior: Suede Cushion; Wireless: Fast Wireless Compatible",
                "Compatible with Samsung Galaxy S23 Ultra. Full access to bottom S-Pen holster.",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
                "Cognac Brown, Rustic Tan, Midnight Black",
                "10ft / 3m Protection",
                4.9,
                55,
                false
            ),
            new Product(
                "CH-ZFLIP5-WAL-01",
                "Metropolis Folio Card Wallet",
                "metropolis-wallet-samsung-z-flip-5",
                Brand.SAMSUNG,
                "Samsung Galaxy Z Flip 5",
                Category.WALLET,
                new BigDecimal("32.99"),
                new BigDecimal("39.00"),
                15,
                4,
                "Innovative two-piece folding wallet with hinge defense and detachable lanyard.",
                "Innovative two-piece folding wallet designed for Galaxy Z Flip 5. Holds 2 cards securely, guards the flexible hinge mechanism, and includes a detachable cross-body wrist lanyard.",
                "Hinge Protection Mechanism, 2 RFID Secure Slots, Free-Stop Folding Angle, Ring Grip Handle",
                "Design: 2-Piece Flexible Hinge; Storage: 2 Cards; Material: Textured Vegan Leather",
                "Compatible with Samsung Galaxy Z Flip 5. Fits outer Flex Window screen perfectly.",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "Lavender Mist, Cream, Matte Charcoal",
                "10ft / 3m Multi-Angle Drop",
                4.7,
                31,
                false
            ),

            // --- XIAOMI ---
            new Product(
                "CH-MI14U-MAG-01",
                "Apex Magnetic Halo Armor Case",
                "apex-magnetic-halo-xiaomi-14-ultra",
                Brand.XIAOMI,
                "Xiaomi 14 Ultra",
                Category.MAGSAFE,
                new BigDecimal("35.99"),
                new BigDecimal("45.00"),
                20,
                4,
                "360° rotating Leica lens ring kickstand and strong magnetic MagSafe lock.",
                "Engineered for the iconic Leica circular camera array on Xiaomi 14 Ultra. Features an aerospace alloy rotating kickstand ring that doubles as a MagSafe magnetic lock and tabletop stand.",
                "360° Rotating Lens Kickstand Ring, Strong MagSafe Core, Leica Camera Bezel Lift, Carbon Fiber Texture",
                "Camera Guard: 360° Aviation Alloy Ring; Kickstand Angles: 30° to 120°; Magnet: N52 Array",
                "Compatible with Xiaomi 14 Ultra. Precision cutouts for quad Leica lenses and dual flash.",
                "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
                "Cyberpunk Black, Titanium Silver, Alpine White",
                "14ft / 4.2m Heavy Duty",
                5.0,
                76,
                true
            ),
            new Product(
                "CH-MI14-SIL-01",
                "AuraGel Soft Liquid Silicone",
                "auragel-soft-silicone-xiaomi-14",
                Brand.XIAOMI,
                "Xiaomi 14",
                Category.SILICONE,
                new BigDecimal("16.99"),
                new BigDecimal("22.00"),
                50,
                6,
                "Baby-skin soft touch silicone with 360-degree wrap around square camera island.",
                "Silky smooth touch with baby-skin texture silicone. Full 360-degree wrapped protection around the camera housing and power buttons. Dust-repellent and sweat-resistant.",
                "Shock-Absorbent Gel, Sweat-Resistant Coating, Microfiber Scratch Defense, Ultra-Lightweight",
                "Weight: 24g; Texture: Hydrophobic Silk Touch; Lining: Soft Microfiber",
                "Compatible with Xiaomi 14 (6.36-inch compact flagship).",
                "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
                "Emerald Jade, Basalt Black, Snow White, Sky Blue",
                "8ft / 2.5m Standard",
                4.8,
                43,
                false
            ),
            new Product(
                "CH-MI13TP-CLR-01",
                "OptiShield Shockproof Clear Bumper",
                "optishield-clear-xiaomi-13t-pro",
                Brand.XIAOMI,
                "Xiaomi 13T Pro",
                Category.CLEAR,
                new BigDecimal("15.99"),
                new BigDecimal("21.00"),
                35,
                5,
                "Scratch-proof acrylic back with 4-corner air cushion bumpers for drop defense.",
                "High clarity scratch-resistant acrylic backing with 4-corner air bag shock absorbers to withstand heavy accidental drops on concrete or tiles. Non-slip grooved side edges.",
                "Corner Airbag Protection, Crystal Transparency, Anti-Fingerprint Dot Matrix, Easy Grip Sides",
                "Drop Protection: 10ft / 3m; Backplate: 2.0mm High-Tensile Acrylic; Bumpers: Flexible TPU",
                "Compatible with Xiaomi 13T and Xiaomi 13T Pro.",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
                "Pure Clear, Smoke Black Edge",
                "10ft / 3m Tested",
                4.7,
                39,
                false
            ),
            new Product(
                "CH-MI14-LEA-01",
                "Milano Saffiano Vegan Leather Case",
                "milano-saffiano-leather-xiaomi-14",
                Brand.XIAOMI,
                "Xiaomi 14",
                Category.LEATHER,
                new BigDecimal("33.99"),
                new BigDecimal("42.00"),
                16,
                4,
                "Durable water-resistant Saffiano cross-hatch grain with gold accent lens ring.",
                "Durable cross-hatch Saffiano textured vegan leather that is water-resistant, scratch-proof, and effortlessly elegant for executive meetings. Features gold electroplated camera accent.",
                "Saffiano Grain Water-Resistant Texture, Gold Accent Camera Ring, Soft Microfiber Core, Slim Form Factor",
                "Pattern: Classic Saffiano Diagonal Crosshatch; Accents: Electroplated Gold Alloy",
                "Compatible with Xiaomi 14. Supports 50W wireless turbo charging.",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
                "Midnight Navy, Cognac Caramel, Jet Black",
                "9ft / 2.8m Protection",
                4.9,
                29,
                true
            ),
            new Product(
                "CH-RDN13P-WAL-01",
                "UrbanFolio Multi-Card Stand Wallet",
                "urbanfolio-wallet-redmi-note-13-pro-plus",
                Brand.XIAOMI,
                "Redmi Note 13 Pro+",
                Category.WALLET,
                new BigDecimal("24.99"),
                new BigDecimal("32.00"),
                22,
                4,
                "Practical daily carry folio with clear ID window, 2 card slots, and cash compartment.",
                "Practical daily carry folio case featuring 3 card slots, a clear ID window, side currency slot, and strong magnetic closure tab. Hands-free landscape stand for video playback.",
                "ID Card Window + 2 Card Slots, Cash Pocket, Magnetic Secure Latch, Landscape Hands-Free Stand",
                "Slots: 1 Clear ID + 2 Credit Cards + Cash Folio; Material: Embossed Vegan PU",
                "Compatible with Xiaomi Redmi Note 13 Pro+ (Curved AMOLED display).",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&w=800&q=80",
                "Vintage Brown, Carbon Black, Crimson Wine",
                "10ft / 3m All-Round Protection",
                4.7,
                46,
                false
            )
        );

        productRepository.saveAll(seedProducts);

        // Record initial inventory movements for full audit history
        for (Product p : seedProducts) {
            stockMovementRepository.save(new StockMovement(
                p.getId(),
                p.getName(),
                p.getSku(),
                StockMovementType.STOCK_IN,
                p.getStock(),
                0,
                p.getStock(),
                "Initial catalog stock initialization",
                "INIT-" + p.getSku(),
                "SYSTEM"
            ));
        }

        log.info(">>> CaseHaven Seed Data: Successfully seeded {} enterprise phone cases with SKUs and stock movements!", seedProducts.size());
    }
}
