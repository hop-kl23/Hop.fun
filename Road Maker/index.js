$(function() {
  $(".element:not(.prebuilt)").draggable({
    drag: function(event, ui) {
      const snapTolerance = 30;
      const $this = $(this);
      const w = $this.outerWidth();
      const h = $this.outerHeight();
      
      let isSnapped = false;

      $(".element").not(this).each(function() {
        const target = $(this);
        const tPos = target.position();
        const tW = target.outerWidth();

        // Calculate Horizontal Distances
        const distToLeft = Math.abs(ui.position.left + w - tPos.left);
        const distToRight = Math.abs(ui.position.left - (tPos.left + tW));
        
        // Calculate Vertical Distance (for the straight line)
        const distVertical = Math.abs(ui.position.top - tPos.top);

        if (distVertical < snapTolerance) {
          // Snap to Left Side of target
          if (distToLeft < snapTolerance) {
            ui.position.left = tPos.left - w;
            ui.position.top = tPos.top; // Force straight line
            isSnapped = true;
          } 
          // Snap to Right Side of target
          else if (distToRight < snapTolerance) {
            ui.position.left = tPos.left + tW;
            ui.position.top = tPos.top; // Force straight line
            isSnapped = true;
          }
        }
      });

      // If not snapped to any side, follow the mouse vertically
      if (!isSnapped) {
        ui.position.top = event.pageY - ($("#gameScreen").offset().top) - (h / 2);
      }
    }
  });
});
