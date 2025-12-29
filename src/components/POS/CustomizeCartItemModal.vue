{{ --resources / views / cart / partials / customize - modal.blade.php-- }}

<dialog id="dlgCustomize" class="bg-transparent p-0">
  {{-- Backdrop (click outside closes via JS using [data-close]) --}}
  <div
    class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 sm:p-6"
    data-close="dlgCustomize"
  >
    {{-- Card --}}
    <div
      class="w-[94vw] max-w-lg md:max-w-xl lg:max-w-2xl
             rounded-2xl border border-white/60 dark:border-slate-800/80
             bg-white/95 dark:bg-slate-950/95 shadow-2xl shadow-indigo-200/40
             grid grid-rows-[auto,1fr,auto] max-h-[92vh] overflow-hidden"
      {{-- Prevent backdrop close when clicking inside card --}}
      onclick="event.stopPropagation()"
    >
      {{-- Header (edit-modal style) --}}
      <div
        class="px-5 py-3 border-b border-slate-100/70 dark:border-slate-800/80
               bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-800
               text-slate-50 flex items-center justify-between gap-3"
      >
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 border border-white/30">
              <i class="bi bi-sliders2 text-[13px]"></i>
            </span>
            <span id="czTitle" class="truncate">Customize</span>
          </div>
          <p id="czSubtitle" class="mt-0.5 text-[11px] text-slate-200/80">
            Choose variant & options, then add to cart.
          </p>
        </div>

        <button
          type="button"
          data-close="dlgCustomize"
          class="inline-flex h-8 w-8 items-center justify-center rounded-full
                 bg-white/10 hover:bg-white/20 text-slate-50 text-[12px] transition"
          aria-label="Close"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      {{-- Body (scrolls like Vue, hidden scrollbar) --}}
      <div class="p-5 space-y-6 overflow-y-auto no-scrollbar">
        {{-- Item summary (Vue-like) --}}
        <div class="flex items-center gap-3">
          <img
            id="czImg"
            src="/menu.png"
            class="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            alt=""
          />

          <div class="min-w-0">
            <div id="czItemName" class="text-sm font-semibold text-slate-900 dark:text-white truncate">
              Item name
            </div>
            <div class="text-xs text-slate-500">
              Code: <span id="czItemCode">—</span>
            </div>
          </div>

          {{-- Subtotal line (Vue-like) --}}
          <div class="ml-auto text-right">
            <div class="text-xs text-slate-600 dark:text-slate-300">Subtotal</div>
            <div class="text-base font-semibold text-slate-900 dark:text-white whitespace-nowrap">
              <span id="czUnitPrice">$0.00</span> × <span id="czQtyText">1</span> =
              <span id="czSubtotal">$0.00</span>
            </div>
          </div>

          <div id="czMaxWrap" class="ml-4 text-xs sm:text-sm hidden">
            <span class="font-medium text-slate-700 dark:text-slate-200">Max:</span>
            <span class="font-semibold" id="czMaxQty">0</span>
          </div>
        </div>

        {{-- VARIANTS --}}
        <div id="czVariantsWrap" class="space-y-2 hidden">
          <div class="text-sm font-medium text-slate-800 dark:text-slate-200">
            Variant
          </div>

          <div id="czVariants" class="flex flex-wrap gap-2">
            {{-- JS inject variant pills:
                active: bg-indigo-600 text-white border-transparent
                idle:   bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40
            --}}
          </div>
        </div>

        {{-- Quantity --}}
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
            Quantity
          </label>

          <div class="inline-flex items-center gap-2">
            <button
              id="czDecQty"
              type="button"
              class="w-9 h-9 rounded-full flex items-center justify-center
                     bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700
                     disabled:opacity-50"
            >−</button>

            <input
              id="czQty"
              type="number"
              min="1"
              value="1"
              class="w-20 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700
                     bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-center
                     focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400"
            />

            <button
              id="czIncQty"
              type="button"
              class="w-9 h-9 rounded-full flex items-center justify-center
                     bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >＋</button>
          </div>

          <p id="czQtyHelp" class="text-xs text-slate-500">
            Choose how many to add.
          </p>
        </div>

        {{-- ICE --}}
        <div class="space-y-2">
          <div class="text-sm font-medium text-slate-800 dark:text-slate-200">Ice</div>
          <div id="czIce" class="flex flex-wrap gap-2">
            {{-- JS inject pills --}}
          </div>
        </div>

        {{-- SUGAR --}}
        <div class="space-y-2">
          <div class="text-sm font-medium text-slate-800 dark:text-slate-200">Sugar</div>
          <div id="czSugar" class="flex flex-wrap gap-2">
            {{-- JS inject pills --}}
          </div>
        </div>

        {{-- Quick notes --}}
        <div id="czQuickNotesWrap" class="space-y-2 hidden">
          <div class="text-sm font-medium text-slate-800 dark:text-slate-200">Quick notes</div>
          <div id="czQuickNotes" class="flex flex-wrap gap-2">
            {{-- JS inject note chips --}}
          </div>
        </div>

        {{-- Note --}}
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
            Note
          </label>
          <textarea
            id="czNote"
            rows="3"
            placeholder="Less sugar, no ice…"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700
                   bg-white dark:bg-slate-900 text-slate-800 dark:text-white
                   focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400"
          ></textarea>

          <div class="flex gap-2">
            <button
              id="czClearNote"
              type="button"
              class="px-2.5 py-1 rounded-md text-xs border border-slate-300 dark:border-slate-700
                     hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>
        </div>

        {{-- Error --}}
        <p id="czErr" class="text-[11px] text-rose-500 min-h-[1rem]"></p>
      </div>

      {{-- Footer (Vue-like) --}}
      <div class="px-5 py-3 border-t border-slate-100/70 dark:border-slate-800/80 flex justify-end gap-2">
        <button
          type="button"
          data-close="dlgCustomize"
          class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700
                 text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-950
                 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
        >
          Cancel
        </button>

        <button
          id="btnCzSave"
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white
                 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
        >
          Add to cart
        </button>
      </div>
    </div>
  </div>
</dialog>

<style>
.no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
