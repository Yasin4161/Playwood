// İnşaat Kalıp Yerleştirme Uygulaması
class PanelPlacementApp {
    constructor() {
        this.panels = [];
        this.placedPanels = [];
        this.canvas = null;
        this.ctx = null;
        this.polygonPoints = [];
        this.polygonArea = 0;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
            '#10AC84', '#EE5A24', '#0C2461', '#1DD1A1', '#FD79A8'
        ];
        
        this.init();
        this.loadPanels();
        this.addDefaultPanels();
    }

    init() {
        // DOM elementlerini bul
        this.elements = {
            panelWidth: document.getElementById('panelWidth'),
            panelHeight: document.getElementById('panelHeight'),
            panelCount: document.getElementById('panelCount'),
            addPanelBtn: document.getElementById('addPanelBtn'),
            panelsList: document.getElementById('panelsList'),
            emptyPanels: document.getElementById('emptyPanels'),
            areaWidth: document.getElementById('areaWidth'),
            areaHeight: document.getElementById('areaHeight'),
            allowRotation: document.getElementById('allowRotation'),
            calculateBtn: document.getElementById('calculateBtn'),
            resultsSection: document.getElementById('resultsSection'),
            usedPanelsCount: document.getElementById('usedPanelsCount'),
            remainingArea: document.getElementById('remainingArea'),
            efficiency: document.getElementById('efficiency'),
            panelDetails: document.getElementById('panelDetails'),
            panelDetailsList: document.getElementById('panelDetailsList'),
            visualizationCanvas: document.getElementById('visualizationCanvas'),
            exportBtn: document.getElementById('exportBtn'),
            toast: document.getElementById('toast'),
            polygonCanvas: document.getElementById('polygonCanvas'),
            addPointBtn: document.getElementById('addPointBtn'),
            finishDrawingBtn: document.getElementById('finishDrawingBtn'),
            confirmPolygonBtn: document.getElementById('confirmPolygonBtn'),
            segmentInfo: document.getElementById('segmentInfo')
        };

        // Event listener'ları ekle
        this.elements.addPanelBtn.addEventListener('click', () => this.addPanel());
        this.elements.calculateBtn.addEventListener('click', () => this.calculatePlacement());
        this.elements.exportBtn.addEventListener('click', () => this.exportCanvas());

        // Enter tuşu ile panel ekleme
        this.elements.panelWidth.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPanel();
        });
        this.elements.panelHeight.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPanel();
        });
        this.elements.panelCount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPanel();
        });

        // Enter tuşu ile hesaplama
        this.elements.areaWidth.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculatePlacement();
        });
        this.elements.areaHeight.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculatePlacement();
        });

        // Canvas'ı ayarla
        this.canvas = this.elements.visualizationCanvas;
        this.ctx = this.canvas.getContext('2d');

        this.initPolygonDrawing();
    }

    initPolygonDrawing() {
        this.polygonCanvas = this.elements.polygonCanvas;
        if (!this.polygonCanvas) return;
        this.polygonCtx = this.polygonCanvas.getContext('2d');
        this.isDrawingPolygon = false;

        this.elements.addPointBtn.addEventListener('click', () => {
            this.isDrawingPolygon = true;
        });

        this.elements.finishDrawingBtn.addEventListener('click', () => {
            this.closePolygon();
        });

        this.elements.confirmPolygonBtn.addEventListener('click', () => {
            this.calculatePolygonArea();
        });

        this.polygonCanvas.addEventListener('click', (e) => {
            if (!this.isDrawingPolygon) return;
            const rect = this.polygonCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addPolygonPoint(x, y);
        });
    }

    addPolygonPoint(x, y) {
        this.polygonPoints.push({ x, y });
        const pts = this.polygonPoints;
        const len = pts.length;
        if (len > 1) {
            const prev = pts[len - 2];
            this.polygonCtx.beginPath();
            this.polygonCtx.moveTo(prev.x, prev.y);
            this.polygonCtx.lineTo(x, y);
            this.polygonCtx.stroke();
            const segLen = Math.hypot(x - prev.x, y - prev.y);
            this.elements.segmentInfo.textContent = `Uzunluk: ${segLen.toFixed(2)} px`;
        }
        if (len > 2) {
            const first = pts[0];
            if (Math.hypot(x - first.x, y - first.y) < 5) {
                this.closePolygon();
            }
        }
    }

    closePolygon() {
        if (this.polygonPoints.length < 3) return;
        const pts = this.polygonPoints;
        const first = pts[0];
        const last = pts[pts.length - 1];
        this.polygonCtx.beginPath();
        this.polygonCtx.moveTo(last.x, last.y);
        this.polygonCtx.lineTo(first.x, first.y);
        this.polygonCtx.stroke();
        this.isDrawingPolygon = false;
        this.elements.confirmPolygonBtn.style.display = 'inline-block';
    }

    calculatePolygonArea() {
        let area = 0;
        const pts = this.polygonPoints;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            area += (pts[j].x + pts[i].x) * (pts[j].y - pts[i].y);
        }
        this.polygonArea = Math.abs(area / 2);
        this.elements.segmentInfo.textContent = `Alan: ${this.polygonArea.toFixed(2)} px²`;
        this.elements.confirmPolygonBtn.style.display = 'none';
    }

    // Panel ekleme fonksiyonu
    addPanel() {
        const width = parseFloat(this.elements.panelWidth.value);
        const height = parseFloat(this.elements.panelHeight.value);
        const count = parseInt(this.elements.panelCount.value) || 1;

        // Validasyon
        if (!width || !height || width <= 0 || height <= 0) {
            this.showToast('Lütfen geçerli panel boyutları girin!', 'error');
            return;
        }

        if (count <= 0) {
            this.showToast('Panel adedi 1 veya daha fazla olmalı!', 'error');
            return;
        }

        // Aynı panel var mı kontrol et
        const existingIndex = this.panels.findIndex(panel => 
            panel.width === width && panel.height === height
        );

        if (existingIndex !== -1) {
            // Mevcut panelin sayısını artır
            this.panels[existingIndex].count += count;
            this.showToast(`${count} adet ${width}×${height} panel eklendi! Toplam: ${this.panels[existingIndex].count} adet`, 'success');
        } else {
            // Yeni panel ekle
            const panel = { 
                width, 
                height, 
                count, 
                area: width * height 
            };
            this.panels.push(panel);
            this.showToast(`${count} adet ${width}×${height} panel başarıyla eklendi!`, 'success');
        }

        // Form'u temizle
        this.elements.panelWidth.value = '';
        this.elements.panelHeight.value = '';
        this.elements.panelCount.value = '1';

        // Liste güncelle
        this.updatePanelsList();
        this.savePanels();
    }

    // Paneli sil
    removePanel(index) {
        this.panels.splice(index, 1);
        this.updatePanelsList();
        this.savePanels();
        this.showToast('Panel silindi!', 'success');
    }

    // Panel sayısını artır
    increasePanel(index) {
        if (!this.panels[index].count) this.panels[index].count = 1;
        this.panels[index].count++;
        this.updatePanelsList();
        this.savePanels();
        this.showToast('Panel sayısı artırıldı!', 'success');
    }

    // Panel sayısını azalt
    decreasePanel(index) {
        if (!this.panels[index].count) this.panels[index].count = 1;
        if (this.panels[index].count > 1) {
            this.panels[index].count--;
            this.updatePanelsList();
            this.savePanels();
            this.showToast('Panel sayısı azaltıldı!', 'success');
        } else {
            this.showToast('Panel sayısı 1\'den az olamaz!', 'warning');
        }
    }

    // Panel listesini güncelle
    updatePanelsList() {
        if (this.panels.length === 0) {
            this.elements.emptyPanels.style.display = 'block';
            this.elements.panelsList.innerHTML = '';
            this.elements.panelsList.appendChild(this.elements.emptyPanels);
            return;
        }

        this.elements.emptyPanels.style.display = 'none';
        
        const panelsHTML = this.panels.map((panel, index) => `
            <div class="panel-item">
                <div class="panel-info">
                    <div class="panel-size">${panel.width} × ${panel.height} cm</div>
                    <div class="panel-area">${(panel.area / 10000).toFixed(2)} m² × ${panel.count || 1} adet</div>
                    <div class="panel-total">Toplam: ${((panel.area * (panel.count || 1)) / 10000).toFixed(2)} m²</div>
                </div>
                <div class="panel-actions">
                    <button class="btn btn-count" onclick="app.decreasePanel(${index})" title="Azalt">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="panel-count-display">${panel.count || 1}</span>
                    <button class="btn btn-count" onclick="app.increasePanel(${index})" title="Artır">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.removePanel(${index})" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.elements.panelsList.innerHTML = panelsHTML;
    }

    // Yerleştirme hesaplaması
    calculatePlacement() {
        // Validasyon
        if (this.panels.length === 0) {
            this.showToast('Önce panel ekleyin!', 'error');
            return;
        }

        const areaWidth = parseFloat(this.elements.areaWidth.value);
        const areaHeight = parseFloat(this.elements.areaHeight.value);

        if (!areaWidth || !areaHeight || areaWidth <= 0 || areaHeight <= 0) {
            this.showToast('Lütfen geçerli alan boyutları girin!', 'error');
            return;
        }

        // Metre'den cm'ye dönüştür
        const areaCmWidth = areaWidth * 100;
        const areaCmHeight = areaHeight * 100;
        const totalArea = areaWidth * areaHeight;

        // Yerleştirme algoritmasını çalıştır
        this.placedPanels = this.placePanels(areaCmWidth, areaCmHeight);

        // Sonuçları hesapla
        const results = this.calculateResults(totalArea);
        
        // Beşon hesaplamalarını yap
        const beamRequirements = this.calculateBeamRequirements(areaWidth, areaHeight);
        
        // Kalıp panel hesaplamalarını yap
        const formPanels = this.calculateFormPanels(areaWidth, areaHeight);

        // Sonuçları göster
        this.displayResults(results, beamRequirements, formPanels);
        this.drawVisualization(areaCmWidth, areaCmHeight);

        // Sonuçlar bölümünü göster
        this.elements.resultsSection.style.display = 'block';
        this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });

        this.showToast('Yerleştirme hesaplandı!', 'success');
    }

    // Panel yerleştirme algoritması
    placePanels(areaWidth, areaHeight) {
        const placed = [];
        const allowRotation = this.elements.allowRotation.checked;

        // Panelleri alan büyüklüğüne göre sırala (büyükten küçüğe)
        const sortedPanels = [...this.panels].sort((a, b) => b.area - a.area);

        // Kullanılabilir alanları tutacak grid sistemi
        const occupiedGrid = Array(Math.ceil(areaHeight)).fill(null)
            .map(() => Array(Math.ceil(areaWidth)).fill(false));

        // Her panel türü için yerleştirme dene
        for (const panel of sortedPanels) {
            let panelCount = 0;
            const maxPanels = panel.count || 1; // Panel sayısı ile sınırla

            while (panelCount < maxPanels) {
                let bestPosition = null;
                let bestRotation = false;

                // Normal yönelim dene
                const normalPos = this.findBestPosition(occupiedGrid, panel.width, panel.height, areaWidth, areaHeight);
                if (normalPos) {
                    bestPosition = normalPos;
                }

                // Döndürülmüş yönelim dene (eğer izin verilmişse ve farklı boyutlarda ise)
                if (allowRotation && panel.width !== panel.height) {
                    const rotatedPos = this.findBestPosition(occupiedGrid, panel.height, panel.width, areaWidth, areaHeight);
                    if (rotatedPos && (!bestPosition || this.isPositionBetter(rotatedPos, bestPosition))) {
                        bestPosition = rotatedPos;
                        bestRotation = true;
                    }
                }

                // Eğer uygun pozisyon bulunamadıysa döngüden çık
                if (!bestPosition) break;

                // Panel'i yerleştir
                const placedPanel = {
                    width: bestRotation ? panel.height : panel.width,
                    height: bestRotation ? panel.width : panel.height,
                    x: bestPosition.x,
                    y: bestPosition.y,
                    originalPanel: panel,
                    rotated: bestRotation,
                    color: this.colors[this.panels.indexOf(panel) % this.colors.length]
                };

                placed.push(placedPanel);
                panelCount++;

                // Grid'i güncelle
                this.markOccupied(occupiedGrid, bestPosition.x, bestPosition.y, placedPanel.width, placedPanel.height);
            }
        }

        return placed;
    }

    // En iyi pozisyonu bul
    findBestPosition(occupiedGrid, panelWidth, panelHeight, areaWidth, areaHeight) {
        // Sol üstten başlayarak tara
        for (let y = 0; y <= areaHeight - panelHeight; y++) {
            for (let x = 0; x <= areaWidth - panelWidth; x++) {
                if (this.canPlacePanel(occupiedGrid, x, y, panelWidth, panelHeight)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    // Panel yerleştirilebilir mi kontrol et
    canPlacePanel(occupiedGrid, x, y, width, height) {
        const gridHeight = occupiedGrid.length;
        const gridWidth = occupiedGrid[0].length;

        for (let py = Math.floor(y); py < Math.ceil(y + height) && py < gridHeight; py++) {
            for (let px = Math.floor(x); px < Math.ceil(x + width) && px < gridWidth; px++) {
                if (occupiedGrid[py] && occupiedGrid[py][px]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Grid'de alanı işgal edilmiş olarak işaretle
    markOccupied(occupiedGrid, x, y, width, height) {
        const gridHeight = occupiedGrid.length;
        const gridWidth = occupiedGrid[0].length;

        for (let py = Math.floor(y); py < Math.ceil(y + height) && py < gridHeight; py++) {
            for (let px = Math.floor(x); px < Math.ceil(x + width) && px < gridWidth; px++) {
                if (occupiedGrid[py]) {
                    occupiedGrid[py][px] = true;
                }
            }
        }
    }

    // Pozisyon karşılaştırması (sol üst öncelikli)
    isPositionBetter(pos1, pos2) {
        if (pos1.y !== pos2.y) return pos1.y < pos2.y;
        return pos1.x < pos2.x;
    }

    // Beşon hesaplama
    calculateBeamRequirements(areaWidth, areaHeight) {
        // Alan boyutları metre cinsinden
        const widthM = areaWidth;
        const heightM = areaHeight;
        
        // Kısa ve uzun kenarları bul
        const shortEdgeM = Math.min(widthM, heightM);
        const longEdgeM = Math.max(widthM, heightM);
        const longEdgeCm = longEdgeM * 100;
        
        // Beşon sayısı: uzun kenar cm / 50
        const beamSets = Math.ceil(longEdgeCm / 50);
        
        // Kısa kenara göre optimal beşon kombinasyonu
        const beamCombination = this.calculateOptimalBeamCombination(shortEdgeM);
        
        // Kenar beşonları hesapla - her kenar için 2'şer adet
        const edgeBeams = this.calculateEdgeBeams(areaWidth, areaHeight);
        
        return {
            shortEdgeM: shortEdgeM,
            longEdgeM: longEdgeM,
            beamCombination: beamCombination,
            beamSets: beamSets,
            edgeBeams: edgeBeams
        };
    }

    // Kenar beşonları hesapla - her kenar için 2'şer adet
    calculateEdgeBeams(areaWidth, areaHeight) {
        // Kenar uzunlukları
        const topBottomLength = areaWidth; // Üst ve alt kenarlar
        const leftRightLength = areaHeight; // Sol ve sağ kenarlar

        // Benzersiz kenar uzunluklarını grupla
        const uniqueEdges = [];
        
        // Üst-Alt kenarlar (eğer farklıysa ayrı ekle)
        const topBottomCombination = this.calculateOptimalBeamCombination(topBottomLength);
        uniqueEdges.push({
            edgeType: topBottomLength === leftRightLength ? `${topBottomLength.toFixed(2)}m Kenarlar` : `${topBottomLength.toFixed(2)}m Kenar (Üst-Alt)`,
            length: topBottomLength,
            count: topBottomLength === leftRightLength ? 8 : 4, // Eğer aynıysa hepsi, değilse sadece üst-alt
            combination: topBottomCombination,
            totalLength: topBottomLength * (topBottomLength === leftRightLength ? 8 : 4)
        });

        // Sol-Sağ kenarlar (eğer farklıysa ekle)
        if (topBottomLength !== leftRightLength) {
            const leftRightCombination = this.calculateOptimalBeamCombination(leftRightLength);
            uniqueEdges.push({
                edgeType: `${leftRightLength.toFixed(2)}m Kenar (Sol-Sağ)`,
                length: leftRightLength,
                count: 4,
                combination: leftRightCombination,
                totalLength: leftRightLength * 4
            });
        }

        const totalEdgeBeams = 8; // 4 kenar × 2 beşon
        const totalEdgeLength = (topBottomLength * 4) + (leftRightLength * 4);

        return {
            edges: uniqueEdges,
            totalEdgeBeams: totalEdgeBeams,
            totalEdgeLength: totalEdgeLength
        };
    }

    // Optimal beşon kombinasyonu hesapla (2m, 3m, 4m beşonlardan)
    calculateOptimalBeamCombination(lengthM) {
        const combinations = [];

        // Maksimum 4m beşon sayısını hesapla (ama +1m fire olmamasına dikkat et)
        const max4m = Math.floor(lengthM / 4);
        
        // Tüm olası kombinasyonları hesapla
        for (let beam4 = 0; beam4 <= max4m; beam4++) {
            const remaining = lengthM - (beam4 * 4);
            
            // Kalan uzunluk için 3m beşonları hesapla
            const max3m = Math.floor(remaining / 3);
            
            for (let beam3 = 0; beam3 <= max3m; beam3++) {
                const stillRemaining = remaining - (beam3 * 3);
                
                // Kalan için 2m beşonları hesapla
                const beam2 = Math.ceil(stillRemaining / 2);
                const totalLength = beam4 * 4 + beam3 * 3 + beam2 * 2;
                const waste = totalLength - lengthM;
                
                // Fire 1m'den az olmalı (0.99m'ye kadar kabul et)
                if (waste >= 0 && waste < 1) {
                    combinations.push({
                        beam4m: beam4,
                        beam3m: beam3,
                        beam2m: beam2,
                        totalBeams: beam4 + beam3 + beam2,
                        totalLength: totalLength,
                        waste: waste
                    });
                }
            }
        }

        // En az beşon sayısı olan kombinasyonu seç, eşitlik durumunda en az fire olanı
        if (combinations.length === 0) {
            // Hiç uygun kombinasyon yoksa en yakın olanı bul
            return this.findClosestCombination(lengthM);
        }

        combinations.sort((a, b) => {
            if (a.totalBeams !== b.totalBeams) {
                return a.totalBeams - b.totalBeams; // En az beşon sayısı
            }
            return a.waste - b.waste; // En az fire
        });

        return combinations[0];
    }

    // En yakın kombinasyonu bul (tam uygun olmadığında)
    findClosestCombination(lengthM) {
        const maxBeam4 = Math.ceil(lengthM / 4) + 1;
        let bestCombination = null;
        let minDifference = Infinity;

        for (let beam4 = 0; beam4 <= maxBeam4; beam4++) {
            for (let beam3 = 0; beam3 <= 10; beam3++) {
                for (let beam2 = 0; beam2 <= 20; beam2++) {
                    const totalLength = beam4 * 4 + beam3 * 3 + beam2 * 2;
                    const difference = Math.abs(totalLength - lengthM);
                    
                    if (difference < minDifference) {
                        minDifference = difference;
                        bestCombination = {
                            beam4m: beam4,
                            beam3m: beam3,
                            beam2m: beam2,
                            totalBeams: beam4 + beam3 + beam2,
                            totalLength: totalLength,
                            waste: totalLength > lengthM ? totalLength - lengthM : 0
                        };
                    }
                }
            }
        }

        return bestCombination;
    }

    // Toplam beşon ihtiyaçlarını hesapla
    calculateTotalBeamNeeds(edges) {
        let total4m = 0, total3m = 0, total2m = 0;

        edges.forEach(edge => {
            total4m += edge.combination.beam4m * edge.count;
            total3m += edge.combination.beam3m * edge.count;
            total2m += edge.combination.beam2m * edge.count;
        });

        const results = [];
        if (total4m > 0) results.push({ size: '4m Beşon', total: total4m });
        if (total3m > 0) results.push({ size: '3m Beşon', total: total3m });
        if (total2m > 0) results.push({ size: '2m Beşon', total: total2m });

        return results;
    }

    // Kompakt beşon özeti için hesaplama
    calculateTotalBeamNeedsForArea(edges) {
        let total4m = 0, total3m = 0, total2m = 0;

        edges.forEach(edge => {
            total4m += edge.combination.beam4m * edge.count;
            total3m += edge.combination.beam3m * edge.count;
            total2m += edge.combination.beam2m * edge.count;
        });

        const results = [];
        if (total4m > 0) results.push({ size: '4m', total: total4m });
        if (total3m > 0) results.push({ size: '3m', total: total3m });
        if (total2m > 0) results.push({ size: '2m', total: total2m });

        return results;
    }

    // Ana ve kenar beşonlarının toplam hesabı
    calculateAllBeamNeeds(beamRequirements) {
        let total4m = 0, total3m = 0, total2m = 0;

        // Ana beşonlar
        if (beamRequirements.beamCombination) {
            total4m += beamRequirements.beamCombination.beam4m * beamRequirements.beamSets;
            total3m += beamRequirements.beamCombination.beam3m * beamRequirements.beamSets;
            total2m += beamRequirements.beamCombination.beam2m * beamRequirements.beamSets;
        }

        // Kenar beşonlar
        if (beamRequirements.edgeBeams && beamRequirements.edgeBeams.edges) {
            beamRequirements.edgeBeams.edges.forEach(edge => {
                total4m += edge.combination.beam4m * edge.count;
                total3m += edge.combination.beam3m * edge.count;
                total2m += edge.combination.beam2m * edge.count;
            });
        }

        const results = [];
        if (total4m > 0) results.push({ size: '4m Beşon', total: total4m });
        if (total3m > 0) results.push({ size: '3m Beşon', total: total3m });
        if (total2m > 0) results.push({ size: '2m Beşon', total: total2m });

        return results;
    }

    // 40x250cm kalıp panel hesaplama - 4 kenar için doğru hesaplama
    calculateFormPanels(areaWidth, areaHeight) {
        const panels = [];
        
        // Her kenar 250cm'den büyükse kalıp gerekir
        // 250cm = 2.5m, her 2.5m için 1 kalıp, 4 kenar var
        
        // Genişlik kenarları (üst ve alt) - 2 kenar
        const widthPanelsPerEdge = Math.floor(areaWidth / 2.5); // Her kenar için kalıp sayısı (sadece sığanlar)
        const totalWidthPanels = widthPanelsPerEdge * 2; // 2 kenar (üst-alt)
        
        if (widthPanelsPerEdge > 0) {
            panels.push({
                direction: "Genişlik Kenarları (Üst-Alt)",
                length: areaWidth,
                panelCount: totalWidthPanels,
                panelSize: "40x250cm",
                edgeCount: 2,
                panelsPerEdge: widthPanelsPerEdge,
                totalArea: (totalWidthPanels * 0.4 * 2.5).toFixed(2)
            });
        }
        
        // Yükseklik kenarları (sol ve sağ) - 2 kenar  
        const heightPanelsPerEdge = Math.floor(areaHeight / 2.5); // Her kenar için kalıp sayısı (sadece sığanlar)
        const totalHeightPanels = heightPanelsPerEdge * 2; // 2 kenar (sol-sağ)
        
        if (heightPanelsPerEdge > 0) {
            panels.push({
                direction: "Yükseklik Kenarları (Sol-Sağ)",
                length: areaHeight,
                panelCount: totalHeightPanels,
                panelSize: "40x250cm", 
                edgeCount: 2,
                panelsPerEdge: heightPanelsPerEdge,
                totalArea: (totalHeightPanels * 0.4 * 2.5).toFixed(2)
            });
        }
        
        // Toplam kalıp sayısı
        const totalPanels = totalWidthPanels + totalHeightPanels;
        
        return {
            panels,
            totalPanels,
            summary: {
                widthEdges: {
                    length: areaWidth,
                    panelsPerEdge: widthPanelsPerEdge,
                    totalPanels: totalWidthPanels
                },
                heightEdges: {
                    length: areaHeight, 
                    panelsPerEdge: heightPanelsPerEdge,
                    totalPanels: totalHeightPanels
                },
                grandTotal: totalPanels
            }
        };
    }

    // Sonuçları hesapla
    calculateResults(totalAreaM2) {
        const panelCounts = {};
        let totalUsedArea = 0;

        // Panel sayılarını hesapla
        this.placedPanels.forEach(panel => {
            const key = `${panel.originalPanel.width}x${panel.originalPanel.height}`;
            panelCounts[key] = (panelCounts[key] || 0) + 1;
            totalUsedArea += (panel.width * panel.height) / 10000; // cm²'den m²'ye
        });

        const remainingArea = totalAreaM2 - totalUsedArea;
        const efficiency = (totalUsedArea / totalAreaM2) * 100;

        return {
            panelCounts,
            totalPanels: this.placedPanels.length,
            remainingArea: Math.max(0, remainingArea),
            efficiency: Math.min(100, efficiency),
            usedAreaM2: totalUsedArea
        };
    }

    // Sonuçları göster
    displayResults(results, beamRequirements, formPanels = []) {
        this.elements.usedPanelsCount.textContent = results.totalPanels;
        this.elements.remainingArea.textContent = results.remainingArea.toFixed(2);
        this.elements.efficiency.textContent = results.efficiency.toFixed(1);

        // 40x250cm kalıpları kontrol et ve topla
        let total40x250 = 0;
        
        // Diğer panellerde 40x250 var mı kontrol et
        if (results.panelCounts['40x250']) {
            total40x250 += results.panelCounts['40x250'];
            // 40x250'yi normal panellerden çıkar
            delete results.panelCounts['40x250'];
        }
        
        // Yan kalıplardan ekle
        if (formPanels && formPanels.totalPanels > 0) {
            total40x250 += formPanels.totalPanels;
        }

        // Panel detaylarını göster
        let detailsHTML = Object.entries(results.panelCounts)
            .map(([size, count]) => `
                <div class="panel-detail-item">
                    <span class="panel-type">${size} cm</span>
                    <span class="panel-count">${count} adet</span>
                </div>
            `).join('');
        
        // 40x250 kalıp varsa üst paneller gibi ekle
        if (total40x250 > 0) {
            detailsHTML += `
                <div class="panel-detail-item">
                    <span class="panel-type">40x250 cm</span>
                    <span class="panel-count">${total40x250} adet</span>
                </div>
            `;
        }

        // Beşon hesaplamalarını ekle
        const beamHTML = `
            <div class="beam-calculations">
                <h4><i class="fas fa-ruler"></i> Tahmini Beşon İhtiyacı</h4>
                <div class="beam-simple-info">
                    <div><strong>Kısa kenar:</strong> ${beamRequirements.shortEdgeM.toFixed(2)}m</div>
                    <div><strong>Uzun kenar:</strong> ${beamRequirements.longEdgeM.toFixed(2)}m</div>
                    <div><strong>Formül:</strong> Uzun kenar ÷ 0.5m = ${beamRequirements.beamSets} set</div>
                </div>
                <div class="beam-total-only">
                    <strong>Ana Beşon Toplamı:</strong> 
                    ${beamRequirements.beamCombination.beam4m > 0 ? `4m: ${beamRequirements.beamCombination.beam4m * beamRequirements.beamSets} adet` : ''}
                    ${beamRequirements.beamCombination.beam3m > 0 ? `${beamRequirements.beamCombination.beam4m > 0 ? ', ' : ''}3m: ${beamRequirements.beamCombination.beam3m * beamRequirements.beamSets} adet` : ''}
                    ${beamRequirements.beamCombination.beam2m > 0 ? `${(beamRequirements.beamCombination.beam4m > 0 || beamRequirements.beamCombination.beam3m > 0) ? ', ' : ''}2m: ${beamRequirements.beamCombination.beam2m * beamRequirements.beamSets} adet` : ''}
                </div>
                
                <!-- Kenar Beşonları -->
                <div class="edge-beams-section">
                    <h4><i class="fas fa-border-all"></i> Kenar Beşonları</h4>
                    <div class="edge-simple-list">
                        ${beamRequirements.edgeBeams.edges.map(edge => `
                            <div class="edge-simple-item">
                                <span class="edge-length">${edge.edgeType}:</span>
                                <span class="edge-beams">
                                    ${edge.combination.beam4m > 0 ? `4m: ${edge.combination.beam4m * edge.count} adet` : ''}
                                    ${edge.combination.beam3m > 0 ? `${edge.combination.beam4m > 0 ? ', ' : ''}3m: ${edge.combination.beam3m * edge.count} adet` : ''}
                                    ${edge.combination.beam2m > 0 ? `${(edge.combination.beam4m > 0 || edge.combination.beam3m > 0) ? ', ' : ''}2m: ${edge.combination.beam2m * edge.count} adet` : ''}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Toplam Beşon İhtiyacı (En Alt) -->
                <div class="total-beam-summary">
                    <h4><i class="fas fa-calculator"></i> TOPLAM BEŞON İHTİYACI</h4>
                    <div class="total-beam-list">
                        ${this.calculateAllBeamNeeds(beamRequirements).map(beam => `
                            <div class="total-beam-item">
                                <span class="total-beam-type">${beam.size}</span>
                                <span class="total-beam-count">${beam.total} adet</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.elements.panelDetailsList.innerHTML = detailsHTML + beamHTML;
    }

    // Görselleştirme çiz
    drawVisualization(areaWidth, areaHeight) {
        // Canvas boyutlarını ayarla - kenar boyutları için extra alan bırak
        const maxCanvasWidth = 800;
        const maxCanvasHeight = 600;
        const marginSize = 60; // Kenar yazıları için margin
        
        const scale = Math.min((maxCanvasWidth - marginSize * 2) / areaWidth, (maxCanvasHeight - marginSize * 2) / areaHeight);
        
        this.canvas.width = areaWidth * scale + marginSize * 2;
        this.canvas.height = areaHeight * scale + marginSize * 2;

        // PDF benzeri temiz arka plan
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Ana alan koordinatları
        const areaStartX = marginSize;
        const areaStartY = marginSize;
        const areaEndX = areaStartX + areaWidth * scale;
        const areaEndY = areaStartY + areaHeight * scale;

        // Ana inşaat alanı arka planı
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(areaStartX, areaStartY, areaWidth * scale, areaHeight * scale);

        // Grid çiz
        this.drawGrid(scale, areaStartX, areaStartY);

        // Kapatılamayan alanları hesapla ve sarı renkle göster
        this.drawEmptyAreas(areaWidth, areaHeight, scale, areaStartX, areaStartY);

        // Panelleri çiz
        this.placedPanels.forEach(panel => {
            this.drawPanel(panel, scale, areaStartX, areaStartY);
        });

        // Ana alan sınırlarını çiz
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(areaStartX, areaStartY, areaWidth * scale, areaHeight * scale);

        // Kenar boyutlarını yaz
        this.drawDimensions(areaWidth, areaHeight, scale, areaStartX, areaStartY, areaEndX, areaEndY);

        // Legend oluştur
        this.createLegend();
    }

    // Grid çiz - PDF benzeri ince çizgiler
    drawGrid(scale, offsetX, offsetY) {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([2, 2]);

        // 50cm aralıklarla grid
        const gridSize = 50 * scale;
        const areaWidth = this.canvas.width - offsetX * 2;
        const areaHeight = this.canvas.height - offsetY * 2;

        for (let x = 0; x <= areaWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX + x, offsetY);
            this.ctx.lineTo(offsetX + x, offsetY + areaHeight);
            this.ctx.stroke();
        }

        for (let y = 0; y <= areaHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, offsetY + y);
            this.ctx.lineTo(offsetX + areaWidth, offsetY + y);
            this.ctx.stroke();
        }
        
        // Grid çiziminden sonra çizgi stilini normale dön
        this.ctx.setLineDash([]);
    }

    // Panel çiz
    drawPanel(panel, scale, offsetX, offsetY) {
        const x = offsetX + panel.x * scale;
        const y = offsetY + panel.y * scale;
        const width = panel.width * scale;
        const height = panel.height * scale;

        // Panel rengini çiz
        this.ctx.fillStyle = panel.color;
        this.ctx.fillRect(x, y, width, height);

        // Panel sınırlarını çiz
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Panel boyutunu yaz - PDF benzeri temiz görünüm
        const fontSize = Math.max(14, Math.min(width, height) / 6);
        this.ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const text = `${panel.originalPanel.width}×${panel.originalPanel.height}`;
        const textX = x + width / 2;
        const textY = y + height / 2;

        // Kalın siyah gölge
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillText(text, textX + 2, textY + 2);
        
        // Ana beyaz text
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, textX, textY);
    }

    // Kapatılamayan alanları sarı renkle göster
    drawEmptyAreas(areaWidth, areaHeight, scale, offsetX, offsetY) {
        // Kullanılabilir alanları tutacak grid sistemi
        const occupiedGrid = Array(Math.ceil(areaHeight)).fill(null)
            .map(() => Array(Math.ceil(areaWidth)).fill(false));

        // Yerleştirilen panelleri grid'de işaretle
        this.placedPanels.forEach(panel => {
            this.markOccupied(occupiedGrid, panel.x, panel.y, panel.width, panel.height);
        });

        // Boş alanları bul ve sarı renkle göster
        this.emptyAreas = this.findEmptyAreas(occupiedGrid, areaWidth, areaHeight);
        
        this.emptyAreas.forEach(area => {
            const x = offsetX + area.x * scale;
            const y = offsetY + area.y * scale;
            const width = area.width * scale;
            const height = area.height * scale;
            
            // Minimum alan boyutu kontrolü - 1cm x 1cm ve üzeri alanları göster
            if (area.width >= 1 && area.height >= 1 && width > 3 && height > 3) {
                
                // Sarı alanı çiz
                this.ctx.fillStyle = '#FFD700'; // Parlak sarı
                this.ctx.fillRect(x, y, width, height);
                
                // Kalın siyah sınır çiz
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([]);
                this.ctx.strokeRect(x, y, width, height);
                
                // Boş alan boyutunu yaz - PDF benzeri temiz görünüm
                const fontSize = Math.max(12, Math.min(width / 6, height / 3, 18));
                this.ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                const text = `${area.width.toFixed(0)}×${area.height.toFixed(0)} cm`;
                const area_m2 = ((area.width * area.height) / 10000).toFixed(2);
                const areaText = `(${area_m2} m²)`;
                
                const textX = x + width / 2;
                const textY = y + height / 2;
                
                // Siyah gölge efekti için tekst
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                this.ctx.fillText(text, textX + 1, textY - fontSize / 3 + 1);
                this.ctx.font = `${fontSize * 0.7}px 'Segoe UI', Arial, sans-serif`;
                this.ctx.fillText(areaText, textX + 1, textY + fontSize / 2 + 1);
                
                // Ana siyah tekst
                this.ctx.fillStyle = '#000000';
                this.ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
                this.ctx.fillText(text, textX, textY - fontSize / 3);
                
                // Alan miktarını alt satırda yaz
                this.ctx.font = `${fontSize * 0.7}px 'Segoe UI', Arial, sans-serif`;
                this.ctx.fillText(areaText, textX, textY + fontSize / 2);
            }
        });
    }

    // Boş alanları bul - Overlap düzeltmeli algoritma
    findEmptyAreas(occupiedGrid, areaWidth, areaHeight) {
        const emptyAreas = [];
        const processed = Array(Math.ceil(areaHeight)).fill(null)
            .map(() => Array(Math.ceil(areaWidth)).fill(false));

        // Her cm için tarama yap
        for (let y = 0; y < areaHeight; y += 1) {
            for (let x = 0; x < areaWidth; x += 1) {
                // Bu nokta boş mu ve daha önce işlenmemiş mi kontrol et
                if (this.isEmptyCell(occupiedGrid, x, y) && !this.isProcessedCell(processed, x, y)) {
                    // En büyük dikdörtgen boş alanı bul
                    const area = this.findConnectedEmptyArea(occupiedGrid, processed, x, y, areaWidth, areaHeight);
                    if (area && area.width >= 1 && area.height >= 1) { // 1cm x 1cm ve üzeri alanları göster
                        emptyAreas.push(area);
                    }
                }
            }
        }
        
        // Çakışan alanları düzelt
        const correctedAreas = this.removeOverlaps(emptyAreas);
        
        // Boş alanları boyutlarına göre sırala (büyükten küçüğe)
        correctedAreas.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        
        return correctedAreas;
    }

    // Çakışan alanları kaldır ve boyutları düzelt
    removeOverlaps(areas) {
        const correctedAreas = [];
        
        for (let i = 0; i < areas.length; i++) {
            let currentArea = {...areas[i]};
            
            // Bu alanı önceki alanlarla karşılaştır
            for (let j = 0; j < correctedAreas.length; j++) {
                const existingArea = correctedAreas[j];
                
                // Çakışma var mı kontrol et
                if (this.areasOverlap(currentArea, existingArea)) {
                    // Çakışmayı çöz - küçük alanı böl veya çıkart
                    currentArea = this.resolveOverlap(currentArea, existingArea);
                    if (!currentArea) break; // Alan tamamen çakışıyorsa null döner
                }
            }
            
            if (currentArea && currentArea.width >= 1 && currentArea.height >= 1) {
                correctedAreas.push(currentArea);
            }
        }
        
        return correctedAreas;
    }

    // İki alan çakışıyor mu kontrol et
    areasOverlap(area1, area2) {
        return !(area1.x + area1.width <= area2.x || 
                 area2.x + area2.width <= area1.x || 
                 area1.y + area1.height <= area2.y || 
                 area2.y + area2.height <= area1.y);
    }

    // Çakışmayı çöz
    resolveOverlap(newArea, existingArea) {
        // Çakışma alanını hesapla
        const overlapX = Math.max(newArea.x, existingArea.x);
        const overlapY = Math.max(newArea.y, existingArea.y);
        const overlapWidth = Math.min(newArea.x + newArea.width, existingArea.x + existingArea.width) - overlapX;
        const overlapHeight = Math.min(newArea.y + newArea.height, existingArea.y + existingArea.height) - overlapY;
        
        // Yeni alanı böl - çakışmayan kısmı al
        if (newArea.x < existingArea.x) {
            // Sol kısım
            return {
                x: newArea.x,
                y: newArea.y,
                width: existingArea.x - newArea.x,
                height: newArea.height
            };
        } else if (newArea.x + newArea.width > existingArea.x + existingArea.width) {
            // Sağ kısım
            return {
                x: existingArea.x + existingArea.width,
                y: newArea.y,
                width: (newArea.x + newArea.width) - (existingArea.x + existingArea.width),
                height: newArea.height
            };
        } else if (newArea.y < existingArea.y) {
            // Üst kısım
            return {
                x: newArea.x,
                y: newArea.y,
                width: newArea.width,
                height: existingArea.y - newArea.y
            };
        } else if (newArea.y + newArea.height > existingArea.y + existingArea.height) {
            // Alt kısım
            return {
                x: newArea.x,
                y: existingArea.y + existingArea.height,
                width: newArea.width,
                height: (newArea.y + newArea.height) - (existingArea.y + existingArea.height)
            };
        }
        
        // Tamamen çakışıyorsa null döndür
        return null;
    }

    // Hücre boş mu kontrol et
    isEmptyCell(occupiedGrid, x, y) {
        const gridY = Math.floor(y);
        const gridX = Math.floor(x);
        return !occupiedGrid[gridY] || !occupiedGrid[gridY][gridX];
    }

    // Hücre işlenmiş mi kontrol et
    isProcessedCell(processed, x, y) {
        const gridY = Math.floor(y);
        const gridX = Math.floor(x);
        return processed[gridY] && processed[gridY][gridX];
    }

    // En büyük dikdörtgen boş alanı bul
    findConnectedEmptyArea(occupiedGrid, processed, startX, startY, areaWidth, areaHeight) {
        // Bu noktadan başlayarak en büyük dikdörtgeni bul
        const rect = this.findLargestRectangle(occupiedGrid, startX, startY, areaWidth, areaHeight);
        
        if (!rect || rect.width < 1 || rect.height < 1) return null;
        
        // Bu dikdörtgeni işlenmiş olarak işaretle
        for (let y = rect.y; y < rect.y + rect.height && y < areaHeight; y++) {
            for (let x = rect.x; x < rect.x + rect.width && x < areaWidth; x++) {
                const gridY = Math.floor(y);
                const gridX = Math.floor(x);
                if (processed[gridY] && gridX >= 0 && gridX < processed[gridY].length) {
                    processed[gridY][gridX] = true;
                }
            }
        }
        
        return rect;
    }

    // En büyük dikdörtgeni hesapla
    findLargestRectangle(occupiedGrid, startX, startY, areaWidth, areaHeight) {
        let bestRect = null;
        let maxArea = 0;

        // Bu noktadan başlayarak farklı boyutlarda dikdörtgenler dene
        for (let height = 1; height <= areaHeight - startY; height++) {
            let width = 0;
            
            // Bu yükseklik için maksimum genişliği bul
            for (let x = startX; x < areaWidth; x++) {
                let canExtend = true;
                
                // Bu genişlikte tüm satırlar boş mu kontrol et
                for (let y = startY; y < startY + height; y++) {
                    if (!this.isEmptyCell(occupiedGrid, x, y)) {
                        canExtend = false;
                        break;
                    }
                }
                
                if (canExtend) {
                    width++;
                } else {
                    break;
                }
            }
            
            const area = width * height;
            if (area > maxArea && width > 0) {
                maxArea = area;
                bestRect = {
                    x: startX,
                    y: startY,
                    width: width,
                    height: height
                };
            }
        }

        return bestRect;
    }

    // Alan boyutlarını kenarına yaz
    drawDimensions(areaWidth, areaHeight, scale, areaStartX, areaStartY, areaEndX, areaEndY) {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Genişlik yazısı (üst kenar)
        const widthText = `${(areaWidth / 100).toFixed(1)}m (${areaWidth}cm)`;
        this.ctx.fillText(widthText, areaStartX + (areaWidth * scale) / 2, areaStartY - 30);
        
        // Genişlik yazısı (alt kenar)
        this.ctx.fillText(widthText, areaStartX + (areaWidth * scale) / 2, areaEndY + 30);

        // Yükseklik yazısı (sol kenar) - döndürülmüş
        const heightText = `${(areaHeight / 100).toFixed(1)}m (${areaHeight}cm)`;
        this.ctx.save();
        this.ctx.translate(areaStartX - 30, areaStartY + (areaHeight * scale) / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(heightText, 0, 0);
        this.ctx.restore();
        
        // Yükseklik yazısı (sağ kenar) - döndürülmüş
        this.ctx.save();
        this.ctx.translate(areaEndX + 30, areaStartY + (areaHeight * scale) / 2);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.fillText(heightText, 0, 0);
        this.ctx.restore();

        // Çizgiler
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 1;
        
        // Üst ve alt çizgiler
        this.ctx.beginPath();
        this.ctx.moveTo(areaStartX, areaStartY - 20);
        this.ctx.lineTo(areaEndX, areaStartY - 20);
        this.ctx.moveTo(areaStartX, areaEndY + 20);
        this.ctx.lineTo(areaEndX, areaEndY + 20);
        
        // Sol ve sağ çizgiler
        this.ctx.moveTo(areaStartX - 20, areaStartY);
        this.ctx.lineTo(areaStartX - 20, areaEndY);
        this.ctx.moveTo(areaEndX + 20, areaStartY);
        this.ctx.lineTo(areaEndX + 20, areaEndY);
        this.ctx.stroke();
    }

    // Legend oluştur
    createLegend() {
        const existingLegend = document.querySelector('.canvas-legend');
        if (existingLegend) {
            existingLegend.remove();
        }

        const legend = document.createElement('div');
        legend.className = 'canvas-legend';

        const usedPanelTypes = new Set();
        this.placedPanels.forEach(panel => {
            const key = `${panel.originalPanel.width}×${panel.originalPanel.height}`;
            usedPanelTypes.add(key);
        });

        // Panel türlerini ekle
        Array.from(usedPanelTypes).forEach(panelType => {
            const panelIndex = this.panels.findIndex(p => `${p.width}×${p.height}` === panelType);
            const color = this.colors[panelIndex % this.colors.length];

            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${color}"></div>
                <span class="legend-text">${panelType} cm</span>
            `;
            legend.appendChild(legendItem);
        });

        // Sarı (boş) alanları ekle
        if (this.emptyAreas && this.emptyAreas.length > 0) {
            this.emptyAreas.forEach((area, index) => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <div class="legend-color" style="background-color: #FFD700"></div>
                    <span class="legend-text">${area.width.toFixed(0)}×${area.height.toFixed(0)} cm</span>
                `;
                legend.appendChild(legendItem);
            });
        }

        this.canvas.parentElement.appendChild(legend);
    }

    // Canvas'ı PNG olarak indir
    exportCanvas() {
        const link = document.createElement('a');
        link.download = `kalip-yerlestirme-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = this.canvas.toDataURL();
        link.click();

        this.showToast('Görsel indirildi!', 'success');
    }

    // localStorage'a kaydet
    savePanels() {
        localStorage.setItem('panelPlacement_panels', JSON.stringify(this.panels));
    }

    // localStorage'dan yükle
    loadPanels() {
        const saved = localStorage.getItem('panelPlacement_panels');
        if (saved) {
            this.panels = JSON.parse(saved);
            // Eski panel verilerini yeni formata dönüştür
            this.panels = this.panels.map(panel => ({
                ...panel,
                count: panel.count || 1 // Eğer count yoksa 1 olarak ata
            }));
            this.updatePanelsList();
        }
    }

    // Varsayılan panelleri ekle
    addDefaultPanels() {
        // Eğer hiç panel yoksa varsayılan panelleri ekle
        if (this.panels.length === 0) {
            const defaultPanels = [
                { width: 250, height: 125, count: 10 },
                { width: 40, height: 250, count: 5 },
                { width: 55, height: 250, count: 5 }
            ];
            
            defaultPanels.forEach(panel => {
                this.panels.push({ 
                    width: panel.width, 
                    height: panel.height, 
                    count: panel.count,
                    area: panel.width * panel.height 
                });
            });
            
            this.updatePanelsList();
            this.savePanels();
            this.showToast('Varsayılan paneller eklendi!', 'success');
        }
    }

    // Toast bildirimi göster
    showToast(message, type = 'success') {
        const toast = this.elements.toast;
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // Göster
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Gizle
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Uygulamayı başlat
const app = new PanelPlacementApp();

// Global fonksiyonlar (HTML'den çağrılabilir)
window.app = app;
