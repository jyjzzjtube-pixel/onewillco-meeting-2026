(function(){
  'use strict';
  window.SB_STATIC=true;
  var PYEONG_SQM=3.305785;
  var activeTool='area';
  var latestSummary='';
  var zones=[{name:'구역 1',width:5,length:4,unit:'m'}];
  var estimateTopic='주거 인테리어';
  var budgetMode='quick';
  var guideConfig={
    area:{title:'도면의 가로와 세로만 입력하세요',steps:['도면 숫자 입력','㎡·평 자동 확인','결과 복사 또는 상담'],example:'5m × 4m 예시 보기',own:'내 도면 입력'},
    seat:{title:'평수와 주방 비율만 고르세요',steps:['전체 평수 입력','주방 비율 선택','예상 좌석 확인'],example:'15평 예시 보기',own:'내 평수 입력'},
    estimate:{title:'분야와 면적을 선택하세요',steps:['서비스 분야 선택','면적·조건 입력','참고 범위 확인'],example:'30평 예시 보기',own:'내 조건 입력'},
    budget:{title:'받은 견적서 숫자를 그대로 넣으세요',steps:['초기비 입력','월비·기간 입력','총부담 확인'],example:'예시 견적 보기',own:'내 견적 입력'},
    check:{title:'총액과 면적부터 입력하세요',steps:['견적 총액 입력','문서 항목 체크','누락 항목 확인'],example:'20평 예시 보기',own:'내 견적 확인'}
  };

  function n(id,fallback){var el=document.getElementById(id);var v=el?parseFloat(el.value):NaN;return Number.isFinite(v)?v:(fallback||0);}
  function fmt(value,digits){return Number(value||0).toLocaleString('ko-KR',{minimumFractionDigits:digits||0,maximumFractionDigits:digits||0});}
  function clamp(value,min,max){return Math.min(max,Math.max(min,value));}
  function track(name,label){if(window.SB&&typeof window.SB.track==='function')window.SB.track(name,label||activeTool);}
  function setValue(id,value){var el=document.getElementById(id);if(el)el.value=value;}
  function focusAndSelect(id){var el=document.getElementById(id);if(!el)return;el.focus({preventScroll:false});if(typeof el.select==='function')el.select();}
  function updateQuickGuide(name){
    var config=guideConfig[name];if(!config)return;
    document.getElementById('quickStartTitle').textContent=config.title;
    document.getElementById('quickSteps').innerHTML=config.steps.map(function(step,index){return '<li><b>'+(index+1)+'</b><span>'+step+'</span></li>';}).join('');
    document.getElementById('exampleAction').textContent=config.example;
    document.getElementById('clearAction').textContent=config.own;
    var tab=document.querySelector('[data-tool="'+name+'"]');
    if(tab&&window.innerWidth<=620){var strip=tab.parentElement;strip.scrollLeft=Math.max(0,tab.offsetLeft-(strip.clientWidth-tab.offsetWidth)/2);}
  }

  function switchTool(name){
    var tab=document.querySelector('[data-tool="'+name+'"]');
    var panel=document.getElementById('tool-'+name);
    if(!tab||!panel)return;
    document.querySelectorAll('.tabs [role="tab"]').forEach(function(el){el.setAttribute('aria-selected','false');});
    document.querySelectorAll('.tool').forEach(function(el){el.classList.remove('active');el.hidden=true;});
    tab.setAttribute('aria-selected','true');
    panel.hidden=false;panel.classList.add('active');activeTool=name;
    updateQuickGuide(name);
    track('calculator_tab_view',name);
  }

  document.querySelectorAll('.tabs [role="tab"]').forEach(function(tab){tab.addEventListener('click',function(){switchTool(tab.dataset.tool);});});

  function zoneInput(value,field,index,type){
    var attrs=type==='number'?'type="number" min="0" step="0.01" inputmode="decimal"':'type="text"';
    return '<input class="compact-input zone-input" '+attrs+' value="'+String(value).replace(/"/g,'&quot;')+'" data-index="'+index+'" data-field="'+field+'" aria-label="'+(field==='name'?'구역 이름':field==='width'?'가로':'세로')+'">';
  }
  function renderZones(){
    var root=document.getElementById('zoneRows');
    root.innerHTML=zones.map(function(z,i){
      return '<div class="zone-row">'+zoneInput(z.name,'name',i,'text')+zoneInput(z.width,'width',i,'number')+'<span class="times" aria-hidden="true">×</span>'+zoneInput(z.length,'length',i,'number')+'<select class="compact-input zone-unit" data-index="'+i+'" aria-label="치수 단위"><option value="m"'+(z.unit==='m'?' selected':'')+'>m</option><option value="cm"'+(z.unit==='cm'?' selected':'')+'>cm</option><option value="mm"'+(z.unit==='mm'?' selected':'')+'>mm</option></select><button type="button" class="icon-btn zone-remove" data-index="'+i+'" title="구역 삭제" aria-label="'+z.name+' 삭제">×</button></div>';
    }).join('');
    calcArea();
  }
  function toMeters(value,unit){if(unit==='mm')return value/1000;if(unit==='cm')return value/100;return value;}
  function fromMeters(value,unit){if(unit==='mm')return value*1000;if(unit==='cm')return value*100;return value;}
  function cleanDimension(value){return Math.round(value*10000)/10000;}
  function getAreaTotal(){
    return zones.reduce(function(sum,z){var w=toMeters(parseFloat(z.width)||0,z.unit);var l=toMeters(parseFloat(z.length)||0,z.unit);return sum+(w*l);},0);
  }
  function calcArea(){
    var sqm=getAreaTotal();var pyeong=sqm/PYEONG_SQM;var valid=zones.filter(function(z){return (parseFloat(z.width)||0)>0&&(parseFloat(z.length)||0)>0;});
    document.getElementById('areaSqm').textContent=fmt(sqm,2);
    document.getElementById('areaPyeong').textContent=fmt(pyeong,2)+'평';
    document.getElementById('areaZoneCount').textContent=valid.length+'개';
    document.getElementById('areaFormula').textContent=valid.length?valid.map(function(z){return z.name+' '+fmt(toMeters(z.width,z.unit),2)+'×'+fmt(toMeters(z.length,z.unit),2);}).join(' + '):'값을 입력해 주세요';
    document.getElementById('areaRead').textContent=sqm>0?'약 '+fmt(pyeong,2)+'평입니다. '+valid.length+'개 구역을 합산했습니다.':'가로와 세로를 입력하면 결과가 바로 표시됩니다.';
    latestSummary='[도면 면적] '+fmt(sqm,2)+'㎡ · '+fmt(pyeong,2)+'평 · '+valid.length+'개 구역 합산';
    return {sqm:sqm,pyeong:pyeong};
  }
  document.getElementById('zoneRows').addEventListener('input',function(e){
    var index=parseInt(e.target.dataset.index,10);var field=e.target.dataset.field;if(!Number.isInteger(index)||!field||!zones[index])return;
    zones[index][field]=field==='name'?e.target.value:(parseFloat(e.target.value)||0);calcArea();
  });
  document.getElementById('zoneRows').addEventListener('change',function(e){
    if(!e.target.classList.contains('zone-unit'))return;var index=parseInt(e.target.dataset.index,10);if(zones[index]){var oldUnit=zones[index].unit;var newUnit=e.target.value;zones[index].width=cleanDimension(fromMeters(toMeters(parseFloat(zones[index].width)||0,oldUnit),newUnit));zones[index].length=cleanDimension(fromMeters(toMeters(parseFloat(zones[index].length)||0,oldUnit),newUnit));zones[index].unit=newUnit;renderZones();}
  });
  document.getElementById('zoneRows').addEventListener('click',function(e){
    var btn=e.target.closest('.zone-remove');if(!btn)return;var index=parseInt(btn.dataset.index,10);if(zones.length===1){zones[0]={name:'구역 1',width:0,length:0,unit:'m'};}else{zones.splice(index,1);zones.forEach(function(z,i){if(/^구역 \d+$/.test(z.name))z.name='구역 '+(i+1);});}renderZones();
  });
  document.getElementById('addZone').addEventListener('click',function(){zones.push({name:'구역 '+(zones.length+1),width:0,length:0,unit:'m'});renderZones();var inputs=document.querySelectorAll('.zone-row');inputs[inputs.length-1].querySelector('[data-field="width"]').focus();});
  document.getElementById('areaToSeat').addEventListener('click',function(){var a=calcArea();if(a.sqm>0){document.getElementById('seatTotalSqm').value=a.sqm.toFixed(2);document.getElementById('seatTotalPyeong').value=a.pyeong.toFixed(2);calcSeat();}switchTool('seat');window.scrollTo({top:0,behavior:'smooth'});});

  function syncPair(source){
    if(source==='sqm'){var sqm=n('seatTotalSqm');document.getElementById('seatTotalPyeong').value=(sqm/PYEONG_SQM).toFixed(2);}else{var p=n('seatTotalPyeong');document.getElementById('seatTotalSqm').value=(p*PYEONG_SQM).toFixed(2);}calcSeat();
  }
  document.getElementById('seatTotalSqm').addEventListener('input',function(){syncPair('sqm');});
  document.getElementById('seatTotalPyeong').addEventListener('input',function(){syncPair('pyeong');});

  function markCustom(){document.querySelectorAll('#seatPreset button').forEach(function(b){b.classList.toggle('on',b.dataset.preset==='custom');});}
  function setRangePair(rangeId,numId,labelId,suffix){
    var range=document.getElementById(rangeId),num=document.getElementById(numId),label=document.getElementById(labelId);
    function fromRange(){num.value=range.value;label.textContent=range.value+suffix;markCustom();calcSeat();}
    function fromNum(){var v=clamp(parseFloat(num.value)||parseFloat(range.min),parseFloat(range.min),parseFloat(range.max));range.value=v;num.value=v;label.textContent=v+suffix;markCustom();calcSeat();}
    range.addEventListener('input',fromRange);num.addEventListener('input',fromNum);
  }
  setRangePair('kitchenRatio','kitchenRatioNum','kitchenRatioLabel','%');
  setRangePair('layoutEfficiency','layoutEfficiencyNum','layoutEfficiencyLabel','%');

  function applyPreset(name){
    document.querySelectorAll('#seatPreset button').forEach(function(b){b.classList.toggle('on',b.dataset.preset===name);});
    if(name==='lean'){document.getElementById('kitchenRatio').value=20;document.getElementById('kitchenRatioNum').value=20;document.getElementById('supportSqm').value=3.3;document.getElementById('layoutEfficiency').value=78;document.getElementById('layoutEfficiencyNum').value=78;document.getElementById('mixBar').value=20;document.getElementById('mixTwo').value=40;document.getElementById('mixFour').value=40;}
    if(name==='kitchen'){document.getElementById('kitchenRatio').value=30;document.getElementById('kitchenRatioNum').value=30;document.getElementById('supportSqm').value=3.3;document.getElementById('layoutEfficiency').value=72;document.getElementById('layoutEfficiencyNum').value=72;document.getElementById('mixBar').value=15;document.getElementById('mixTwo').value=25;document.getElementById('mixFour').value=60;}
    document.getElementById('kitchenRatioLabel').textContent=document.getElementById('kitchenRatio').value+'%';document.getElementById('layoutEfficiencyLabel').textContent=document.getElementById('layoutEfficiency').value+'%';calcSeat();
  }
  document.getElementById('seatPreset').addEventListener('click',function(e){var b=e.target.closest('button');if(b)applyPreset(b.dataset.preset);});
  ['supportSqm','mixBar','mixTwo','mixFour','barModule','twoModule','fourModule'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){markCustom();calcSeat();});});

  function calcSeat(){
    var total=Math.max(0,n('seatTotalSqm'));var kitchenRatio=clamp(n('kitchenRatio'),0,100);var support=Math.max(0,n('supportSqm'));var efficiency=clamp(n('layoutEfficiency'),0,100);
    var kitchen=total*kitchenRatio/100;var rawHall=total-kitchen-support;var hall=Math.max(0,rawHall);var usable=hall*efficiency/100;var warning=document.getElementById('seatWarning');
    var weights=[Math.max(0,n('mixBar')),Math.max(0,n('mixTwo')),Math.max(0,n('mixFour'))];var sum=weights[0]+weights[1]+weights[2];if(sum<=0){weights=[0,0,0];sum=1;}
    var modules=[Math.max(.1,n('barModule',1.2)),Math.max(.1,n('twoModule',3.2)),Math.max(.1,n('fourModule',5.2))];
    var allocated=weights.map(function(w){return usable*w/sum;});var bar=Math.floor(allocated[0]/modules[0]);var two=Math.floor(allocated[1]/modules[1]);var four=Math.floor(allocated[2]/modules[2]);var seats=bar+two*2+four*4;
    document.getElementById('mixSum').textContent='합계 '+fmt(weights[0]+weights[1]+weights[2]);
    document.getElementById('seatKitchen').textContent=fmt(kitchen,2)+'㎡ ('+fmt(kitchen/PYEONG_SQM,2)+'평)';
    document.getElementById('seatHall').textContent=fmt(hall,2)+'㎡ ('+fmt(hall/PYEONG_SQM,2)+'평)';
    document.getElementById('seatUsable').textContent=fmt(usable,2)+'㎡';document.getElementById('seatTotal').textContent=fmt(seats);
    document.getElementById('seatBar').textContent=bar+'석';document.getElementById('seatTwo').textContent=two+'개 · '+(two*2)+'석';document.getElementById('seatFour').textContent=four+'개 · '+(four*4)+'석';
    document.getElementById('seatBarArea').textContent=fmt(allocated[0],1)+'㎡';document.getElementById('seatTwoArea').textContent=fmt(allocated[1],1)+'㎡';document.getElementById('seatFourArea').textContent=fmt(allocated[2],1)+'㎡';
    document.getElementById('seatRead').textContent=total>0?'현재 입력값으로 약 '+fmt(seats)+'석입니다. 고급 설정은 필요할 때만 조정하세요.':'전체 평수와 주방 비율을 입력하면 예상 좌석이 바로 표시됩니다.';
    if(total>0&&rawHall<0){warning.classList.add('is-warning');warning.textContent='주방과 기타 면적의 합이 전체 면적보다 '+fmt(Math.abs(rawHall),2)+'㎡ 큽니다. 주방 비율 또는 기타 면적을 줄여 주세요.';}else{warning.classList.remove('is-warning');warning.textContent='이 값은 면적 배분 시뮬레이션입니다. 출입구, 피난, 장애인 편의, 기둥, 설비, 테이블 실제 규격을 반영한 배치도와는 차이가 납니다.';}
    latestSummary='[좌석 시뮬레이션] 전체 '+fmt(total/PYEONG_SQM,2)+'평 · 주방 '+fmt(kitchen/PYEONG_SQM,2)+'평 · 홀 '+fmt(hall/PYEONG_SQM,2)+'평 · 다찌 '+bar+'석 · 2인 '+two+'개('+two*2+'석) · 4인 '+four+'개('+four*4+'석)';
  }

  function roundStep(value,step){return Math.round(value/step)*step;}
  function interpolate(points,value){
    if(value<=points[0][0]){var first=points[0];var ratio=value/first[0];return [first[1]*ratio,first[2]*ratio];}
    for(var i=0;i<points.length-1;i++){
      var a=points[i],b=points[i+1];
      if(value<=b[0]){var t=(value-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
    }
    var last=points[points.length-1];var scale=value/last[0];return [last[1]*scale,last[2]*scale];
  }
  function estimateResult(data){
    document.getElementById('estimateKicker').textContent=data.kicker;
    document.getElementById('estimateMain').textContent=data.main;
    document.getElementById('estimateUnit').textContent=data.unit;
    document.getElementById('estimateBasis').textContent=data.basis;
    document.getElementById('estimateCenter').textContent=data.center;
    document.getElementById('estimateFormula').textContent=data.formula;
    document.getElementById('estimateExcluded').textContent=data.excluded;
    document.getElementById('estimateWarning').textContent=data.warning;
    document.getElementById('estimateRead').textContent='현재 선택 조건의 참고값입니다. 계약 견적은 현장 조건을 확인한 뒤 다시 받아야 합니다.';
    latestSummary=data.summary;
  }
  function toggleEstimateGroups(type){
    document.querySelectorAll('[data-estimate-group]').forEach(function(group){group.hidden=group.dataset.estimateGroup!==type;});
  }
  function calcEstimate(){
    var type=document.getElementById('estimateType').value;
    toggleEstimateGroups(type);
    if(type==='residential'){
      estimateTopic='주거 인테리어';
      var pyeong=Math.max(10,n('estimateResidentialPyeong',30));
      var scope=document.getElementById('estimateResidentialScope').value;
      var labels={partial:'부분 리모델링',mid:'주방·욕실 포함 중간급',full:'전체 철거·올 리모델링'};
      var bands={partial:[[20,500,900],[30,900,1500],[40,1500,2500]],mid:[[20,1500,2500],[30,2500,3800],[40,4000,6000]],full:[[20,2500,4000],[30,4000,6500],[40,6000,9000]]};
      var range=interpolate(bands[scope],pyeong);var low=roundStep(range[0],10),high=roundStep(range[1],10);var middle=roundStep((low+high)/2,10);
      var outside=pyeong<20||pyeong>40;
      estimateResult({kicker:'주거 공개 범위 단순 환산',main:fmt(low)+'~'+fmt(high),unit:' 만원',basis:'공개 가이드 1건 · 20/30/40평',center:'범위 중간 '+fmt(middle)+'만원',formula:fmt(pyeong,1)+'평 · '+labels[scope],excluded:'확장·구조변경·고급자재 등',warning:(outside?'공개된 20~40평 범위 밖을 단순 비례 환산했습니다. ':'')+'계약 견적이 아닙니다. 철거·설비·마감재·맞춤가구와 현장 상태에 따라 실제 비용은 달라집니다.',summary:'[간편 비용 가이드 · 주거] '+fmt(pyeong,1)+'평 '+labels[scope]+' · 공개 범위 환산 '+fmt(low)+'~'+fmt(high)+'만원 · 계약 견적 아님'});
      return;
    }
    if(type==='commercial'){
      estimateTopic='상업공간·브랜드 인테리어';
      var commercialPyeong=Math.max(5,n('estimateCommercialPyeong',20));var commercialLow=roundStep(commercialPyeong*110,10),commercialHigh=roundStep(commercialPyeong*200,10),commercialMean=roundStep(commercialPyeong*151,10);
      estimateResult({kicker:'가맹 정보공개서 3건 표본',main:fmt(commercialLow)+'~'+fmt(commercialHigh),unit:' 만원',basis:'3건 · 110~200만원/평',center:'표본 산술평균 '+fmt(commercialMean)+'만원',formula:fmt(commercialPyeong,1)+'평 × 공개 표본 단가',excluded:'철거·냉난방·덕트·소방 등',warning:'일반 시장 평균이나 계약 견적이 아닙니다. 10평·50평의 서로 다른 브랜드 자료이며 간판 포함 여부와 공사 범위가 다릅니다.',summary:'[간편 비용 가이드 · 상업] '+fmt(commercialPyeong,1)+'평 · 정보공개서 3건 환산 '+fmt(commercialLow)+'~'+fmt(commercialHigh)+'만원 · 표본 산술평균 환산 '+fmt(commercialMean)+'만원'});
      return;
    }
    if(type==='building'){
      estimateTopic='건축·시설 조성';
      var buildingSqm=Math.max(10,n('estimateBuildingSqm',100));var buildingAmount=roundStep(buildingSqm*239.2,10);
      estimateResult({kicker:'정부 행정기준 면적 환산',main:fmt(buildingAmount),unit:' 만원',basis:'국토부 2026 표준건축비',center:'239.2만원/㎡',formula:fmt(buildingSqm,1)+'㎡ × 239.2만원',excluded:'토지·설계·인허가·현장 조건',warning:'과밀부담금 부과를 위한 행정기준 환산액이며 주택·상가·업무용 건물의 실제 공사비나 표준 견적이 아닙니다.',summary:'[간편 비용 가이드 · 건축] 연면적 '+fmt(buildingSqm,1)+'㎡ · 행정기준 환산 '+fmt(buildingAmount)+'만원 · 실제 공사견적 아님'});
      return;
    }
    if(type==='sports'){
      estimateTopic='건축·시설 조성';
      var sportsSqm=Math.max(100,n('estimateSportsSqm',1500));var sportsAmount=roundStep(sportsSqm*(78580.1/1516.72),10);
      estimateResult({kicker:'공공발주 1건 면적비례 참고',main:fmt(sportsAmount),unit:' 만원',basis:'거제시 2026 예정금액 1건',center:'약 51.81만원/㎡ 단순 환산',formula:fmt(sportsSqm,1)+'㎡ × 사례 면적비',excluded:'토목·배수·조명·관람·인허가',warning:'표준 단가나 평균가가 아닙니다. 원 사례에는 풋살장·족구장과 이동식 화장실 2개 등 부대시설이 포함돼 실제 프로젝트와 직접 비교할 수 없습니다.',summary:'[간편 비용 가이드 · 체육시설] '+fmt(sportsSqm,1)+'㎡ · 공공발주 1건 면적비례 '+fmt(sportsAmount)+'만원 · 표준단가 아님'});
      return;
    }
    if(type==='equipment'){
      estimateTopic='POS·CCTV·키오스크';
      var plan=document.getElementById('estimateEquipmentPlan').value;var count=parseInt(document.getElementById('estimateCameraCount').value,10)||1;var cameraField=document.getElementById('estimateCameraField');cameraField.hidden=plan!=='cctv-view'&&plan!=='cctv-pass';
      if(plan==='cctv-view'||plan==='cctv-pass'){
        var prices=plan==='cctv-view'?[13200,24200,35200,46200]:[30800,41800,52800,60500];var monthly=prices[count-1]/10000;var planLabel=plan==='cctv-view'?'KT i-view':'KT i-pass';
        estimateResult({kicker:'CCTV 공식 월요금',main:fmt(monthly,2),unit:' 만원/월',basis:planLabel+' · '+count+'대',center:'VAT 포함 공식요금',formula:'36개월 약정·인터넷 결합',excluded:'인터넷·추가저장·특수공사',warning:'공식 페이지의 결합 조건 요금입니다. 설치 환경, 저장일수, 출입장치, 출동·이전 조건과 프로모션 적용 여부는 상담에서 다시 확인해야 합니다.',summary:'[간편 비용 가이드 · CCTV] '+planLabel+' '+count+'대 · 월 '+fmt(monthly,2)+'만원 · VAT 포함/36개월 약정/인터넷 결합 기준'});
      }else if(plan==='pos-app'){
        estimateResult({kicker:'POS 공식 공개정보',main:'0',unit:' 원(앱)',basis:'토스 포스 무료 다운로드',center:'앱 이용 기준',formula:'Windows·Android·iOS·Mac',excluded:'단말기·프린터·VAN·설치',warning:'무료는 POS 앱 다운로드 범위입니다. 결제단말기, 프린터, 키오스크 하드웨어, 설치와 결제 관련 조건은 별도입니다.',summary:'[간편 비용 가이드 · POS] 토스 포스 앱 무료 다운로드 · 장비/설치/VAN 별도'});
      }else{
        estimateResult({kicker:'POS·키오스크 장비',main:'상담',unit:' 필요',basis:'공식 페이지 상담형',center:'기기·설치 조건별',formula:'구매/렌탈·약정 비교',excluded:'단말기·프린터·VAN·공사',warning:'장비 구성과 구매·렌탈 조건이 달라 고정 금액을 계산하지 않습니다. POS·CCTV·키오스크를 한 묶음으로 상담하되 견적서는 항목별로 분리해 받으세요.',summary:'[간편 비용 가이드 · 운영기기] POS·키오스크 장비는 구성/설치/약정별 서면 견적 필요'});
      }
      return;
    }
    estimateTopic='세무·회계 관리';
    var accountingPlan=document.getElementById('estimateAccountingPlan').value;var months=clamp(Math.round(n('estimateAccountingMonths',12)),1,60);var monthlyVat=accountingPlan==='ai'?3.63:8.8;var total=monthlyVat*months;var accountingLabel=accountingPlan==='ai'?'AI 경리':'세무대행 패키지';
    estimateResult({kicker:'세무·회계 공식요금 환산',main:fmt(total,1)+(accountingPlan==='tax'?'부터':''),unit:' 만원 / '+months+'개월',basis:'자비스 '+accountingLabel,center:'월 '+fmt(monthlyVat,2)+'만원(VAT 포함)',formula:fmt(monthlyVat,2)+' × '+months+'개월',excluded:accountingPlan==='ai'?'세무대리·신고 업무':'일부 세금신고·규모별 증액',warning:(accountingPlan==='tax'?'월 8만원부터이며 사업자 규모에 따라 달라집니다. 법인세·종합소득세 등 일부 신고는 별도 과금될 수 있습니다. ':'AI 경리는 재무관리 도구이며 세무대행이 아닙니다. ')+'실제 업무 수행 주체와 범위는 자격 있는 담당자의 계약서로 확인하세요.',summary:'[간편 비용 가이드 · 세무회계] '+accountingLabel+' · 월 VAT 포함 '+fmt(monthlyVat,2)+'만원'+(accountingPlan==='tax'?'부터':'')+' × '+months+'개월 = '+fmt(total,1)+'만원'+(accountingPlan==='tax'?'부터':'')});
  }
  document.getElementById('estimateType').addEventListener('change',calcEstimate);
  ['estimateResidentialPyeong','estimateResidentialScope','estimateCommercialPyeong','estimateBuildingSqm','estimateSportsSqm','estimateEquipmentPlan','estimateCameraCount','estimateAccountingPlan','estimateAccountingMonths'].forEach(function(id){document.getElementById(id).addEventListener('input',calcEstimate);document.getElementById(id).addEventListener('change',calcEstimate);});

  function detailedInitial(){return ['budgetInterior','budgetPos','budgetKiosk','budgetCctv','budgetOtherInitial'].reduce(function(sum,id){return sum+Math.max(0,n(id));},0);}
  function detailedMonthly(){return ['budgetPosMonthly','budgetCctvMonthly','budgetTaxMonthly','budgetOtherMonthly'].reduce(function(sum,id){return sum+Math.max(0,n(id));},0);}
  function setBudgetMode(mode){
    if(mode!=='quick'&&mode!=='detail')return;
    if(mode==='detail'&&detailedInitial()===0&&detailedMonthly()===0){
      setValue('budgetOtherInitial',Math.max(0,n('budgetQuickInitial')));
      setValue('budgetOtherMonthly',Math.max(0,n('budgetQuickMonthly')));
    }
    if(mode==='quick'){
      setValue('budgetQuickInitial',detailedInitial());
      setValue('budgetQuickMonthly',detailedMonthly());
    }
    budgetMode=mode;
    document.getElementById('budgetQuick').hidden=mode!=='quick';
    document.getElementById('budgetDetailed').hidden=mode!=='detail';
    document.querySelectorAll('#budgetMode button').forEach(function(button){
      var selected=button.dataset.budgetMode===mode;button.classList.toggle('on',selected);button.setAttribute('aria-pressed',selected?'true':'false');
    });
    calcBudget();
  }
  document.getElementById('budgetMode').addEventListener('click',function(event){var button=event.target.closest('[data-budget-mode]');if(button)setBudgetMode(button.dataset.budgetMode);});
  function calcBudget(){
    var initial=budgetMode==='quick'?Math.max(0,n('budgetQuickInitial')):detailedInitial();
    var monthly=budgetMode==='quick'?Math.max(0,n('budgetQuickMonthly')):detailedMonthly();var months=clamp(Math.round(n('budgetMonths',36)),1,120);var recurring=monthly*months;var grand=initial+recurring;
    document.getElementById('budgetPeriodLabel').textContent=months+'개월';document.getElementById('budgetGrand').textContent=fmt(grand,1);document.getElementById('budgetInitial').textContent=fmt(initial,1)+'만원';document.getElementById('budgetMonthly').textContent=fmt(monthly,1)+'만원';document.getElementById('budgetRecurring').textContent=fmt(recurring,1)+'만원';
    document.getElementById('budgetRead').textContent=grand>0?'초기 '+fmt(initial,1)+'만원과 월 '+fmt(monthly,1)+'만원 × '+months+'개월을 합친 값입니다.':'빈 항목은 0원으로 계산합니다. 받은 견적서 숫자만 입력하세요.';
    latestSummary='[실견적 총비용] 초기 '+fmt(initial,1)+'만원 + 월 '+fmt(monthly,1)+'만원 × '+months+'개월 = '+fmt(grand,1)+'만원';
  }
  document.querySelectorAll('.budget-input').forEach(function(el){el.addEventListener('input',calcBudget);});

  function calcCheck(){
    var amount=Math.max(0,n('checkAmount'));var sqm=Math.max(0,n('checkSqm'));var pyeong=sqm/PYEONG_SQM;var perP=pyeong>0?amount/pyeong:0;var perSqm=sqm>0?amount/sqm:0;var checks=Array.prototype.slice.call(document.querySelectorAll('#quoteChecks input'));var done=checks.filter(function(c){return c.checked;}).length;
    document.getElementById('checkPerPyeong').textContent=fmt(perP,1)+'만원/평';document.getElementById('checkPerSqm').textContent=fmt(perSqm,1);document.getElementById('checkDone').textContent=done+' / '+checks.length;document.getElementById('checkMissing').textContent=(checks.length-done)+'개';
    document.getElementById('checkRead').textContent=amount>0&&sqm>0?'평당 '+fmt(perP,1)+'만원으로 환산됩니다. 문서상 추가 확인 '+(checks.length-done)+'개입니다.':'총액과 면적을 넣으면 단가와 누락 개수가 바로 표시됩니다.';
    latestSummary='[견적서 체크] 총 '+fmt(amount,1)+'만원 · '+fmt(pyeong,1)+'평 · '+fmt(perP,1)+'만원/평 · 계약항목 '+done+'/'+checks.length+' 확인';
  }
  document.getElementById('checkAmount').addEventListener('input',calcCheck);
  document.getElementById('checkSqm').addEventListener('input',function(){var sqm=Math.max(0,n('checkSqm'));document.getElementById('checkPyeong').value=sqm>0?(sqm/PYEONG_SQM).toFixed(2):'';calcCheck();});
  document.getElementById('checkPyeong').addEventListener('input',function(){var pyeong=Math.max(0,n('checkPyeong'));document.getElementById('checkSqm').value=pyeong>0?(pyeong*PYEONG_SQM).toFixed(2):'';calcCheck();});document.getElementById('quoteChecks').addEventListener('change',calcCheck);

  function currentSummary(){if(activeTool==='area')calcArea();else if(activeTool==='seat')calcSeat();else if(activeTool==='estimate')calcEstimate();else if(activeTool==='budget')calcBudget();else calcCheck();return latestSummary;}
  function handoff(){
    var summary=currentSummary();var pyeong=activeTool==='area'?getAreaTotal()/PYEONG_SQM:n('seatTotalPyeong');var topic=activeTool==='estimate'?estimateTopic:'상업공간·브랜드 인테리어';
    if(activeTool==='estimate'&&document.getElementById('estimateType').value==='residential')pyeong=n('estimateResidentialPyeong');
    if(activeTool==='estimate'&&document.getElementById('estimateType').value==='commercial')pyeong=n('estimateCommercialPyeong');
    try{localStorage.setItem('sbCalcResult',JSON.stringify({tool:'공간 계산기',type:'store',typeLabel:'공간 계획',area:Math.round(pyeong*100)/100,min:0,max:0,summary:summary,topicOverride:topic}));}catch(e){}
    track('calculator_consult_handoff',activeTool);
  }
  document.getElementById('consultAction').addEventListener('click',handoff);
  document.addEventListener('focusin',function(event){if(event.target.matches('input,select'))document.body.classList.add('is-editing');});
  document.addEventListener('focusout',function(){setTimeout(function(){if(!document.activeElement||!document.activeElement.matches('input,select'))document.body.classList.remove('is-editing');},0);});
  document.getElementById('exampleAction').addEventListener('click',function(){
    if(activeTool==='area'){
      zones=[{name:'매장',width:5,length:4,unit:'m'}];renderZones();
    }else if(activeTool==='seat'){
      setValue('seatTotalSqm','49.59');setValue('seatTotalPyeong','15');applyPreset('lean');calcSeat();
    }else if(activeTool==='estimate'){
      setValue('estimateType','residential');setValue('estimateResidentialPyeong','30');setValue('estimateResidentialScope','full');calcEstimate();
    }else if(activeTool==='budget'){
      setBudgetMode('quick');setValue('budgetQuickInitial','3119');setValue('budgetQuickMonthly','15.4');setValue('budgetMonths','36');calcBudget();
    }else{
      setValue('checkAmount','3000');setValue('checkPyeong','20');setValue('checkSqm',(20*PYEONG_SQM).toFixed(2));
      document.querySelectorAll('#quoteChecks input').forEach(function(input,index){input.checked=index<3;});calcCheck();
    }
    if(window.innerWidth<=850){var result=document.querySelector('#tool-'+activeTool+' .result-panel');if(result)setTimeout(function(){result.scrollIntoView({behavior:'smooth',block:'start'});},0);}
    track('calculator_example',activeTool);
  });
  document.getElementById('clearAction').addEventListener('click',function(){
    if(activeTool==='area'){
      zones=[{name:'구역 1',width:0,length:0,unit:'m'}];renderZones();
      var width=document.querySelector('#zoneRows [data-field="width"]');if(width){width.focus();width.select();}
    }else if(activeTool==='seat'){
      focusAndSelect('seatTotalPyeong');
    }else if(activeTool==='estimate'){
      var type=document.getElementById('estimateType').value;
      focusAndSelect(type==='residential'?'estimateResidentialPyeong':type==='commercial'?'estimateCommercialPyeong':type==='building'?'estimateBuildingSqm':type==='sports'?'estimateSportsSqm':type==='accounting'?'estimateAccountingMonths':'estimateEquipmentPlan');
    }else if(activeTool==='budget'){
      document.querySelectorAll('.budget-input').forEach(function(input){input.value=input.id==='budgetMonths'?'36':'0';});setBudgetMode('quick');focusAndSelect('budgetQuickInitial');
    }else{
      setValue('checkAmount','');setValue('checkSqm','');setValue('checkPyeong','');document.querySelectorAll('#quoteChecks input').forEach(function(input){input.checked=false;});calcCheck();focusAndSelect('checkAmount');
    }
    track('calculator_own_input',activeTool);
  });
  document.getElementById('copyAction').addEventListener('click',function(){
    var text=currentSummary()+'\n공간브릿지 https://gongganbridge.com';var state=document.getElementById('copyState');
    function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);state.textContent='계산 내용이 복사되었습니다.';}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){state.textContent='계산 내용이 복사되었습니다.';}).catch(fallback);}else fallback();track('calculator_copy',activeTool);
  });

  try{var tool=new URLSearchParams(location.search).get('tool');if(['area','seat','estimate','budget','check'].indexOf(tool)>=0)switchTool(tool);}catch(e){}
  renderZones();calcSeat();calcEstimate();calcBudget();calcCheck();updateQuickGuide(activeTool);
})();
